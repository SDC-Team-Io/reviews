const router = require('express').Router();
const { Pool } = require('pg');
const cacheMiddleware = require('../cacheMiddleware.js');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DATABASE_URL,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: false
});

router.get('/reviews/:id', cacheMiddleware(30), async (req, res) => {
  const id = req.params.id
  try {
    const queryText = `SELECT * FROM reviews WHERE product_id=${id};`;
    const response = await pool.query(queryText);
    res.json(response.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
})

router.get('/reviews/meta/:id', cacheMiddleware(30), async (req, res) => {
  try {
    const productId = req.params.id;

    // Ratings aggregation
    const ratingsQuery = `
      SELECT rating, COUNT(*) as count
      FROM reviews
      WHERE product_id = $1
      GROUP BY rating;
    `;

    // Recommendations aggregation
    const recommendationsQuery = `
      SELECT recommend, COUNT(*) as count
      FROM reviews
      WHERE product_id = $1
      GROUP BY recommend;
    `;

    // Characteristics aggregation
    const characteristicsQuery = `
      SELECT c.name, cr.characteristic_id, AVG(cr.value) as average_value
      FROM characteristics c
      INNER JOIN char_reviews cr ON c.characteristic_id = cr.characteristic_id
      WHERE c.product_id = $1
      GROUP BY c.name, cr.characteristic_id;
    `;

    // Execute queries
    const ratingsResult = await pool.query(ratingsQuery, [productId]);
    const recommendationsResult = await pool.query(recommendationsQuery, [productId]);
    const characteristicsResult = await pool.query(characteristicsQuery, [productId]);

    // Process results
    const ratings = ratingsResult.rows.reduce((acc, row) => {
      acc[row.rating] = parseInt(row.count, 10);
      return acc;
    }, {});

    const recommended = recommendationsResult.rows.reduce((acc, row) => {
      acc[row.recommend] = parseInt(row.count, 10);
      return acc;
    }, {});

    const characteristics = characteristicsResult.rows.reduce((acc, row) => {
      acc[row.name] = {
        id: row.characteristic_id,
        value: parseFloat(row.average_value).toFixed(2)
      };
      return acc;
    }, {});

    // Combine into final result
    const response = {
      product_id: productId,
      ratings,
      recommended,
      characteristics
    };

    res.json(response);

  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.post('/reviews', async (req, res) => {
  const {product_id, rating, summary, body, recommend, name, email, photos, characteristics} = req.body;
  try {
    await pool.query('BEGIN');

    const reviewInsertQuery = `
    INSERT INTO reviews (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id;
  `;

    const reviewResult = await pool.query(reviewInsertQuery, [product_id, rating, summary, body, recommend, name, email]);
    const reviewId = reviewResult.rows[0].id;

    for (const photoUrl of photos) {
      const photoInsertQuery = `
        INSERT INTO photos (review_id, url)
        VALUES ($1, $2);
      `
      await pool.query(photoInsertQuery, [reviewId, photoUrl]);
    }

    for (const [charId, value] of Object.entries(characteristics)) {
      const charReviewInsertQuery = `
        INSERT INTO char_reviews (characteristic_id, review_id, value)
        VALUES ($1, $2, $3);
      `;
      await pool.query(charReviewInsertQuery, [charId, reviewId, value]);
    }

    await pool.query('COMMIT');
    res.status(201).send('Review added successfully');
  } catch (error) {
    await pool.query('ROLLBACK'); // Roll back the transaction on error
    console.error('Error in transaction', error.stack);
    res.status(500).send('Server Error');
  }
})

router.put('/reviews/:review_id/helpful', async (req, res) => {
  const id = req.params.review_id;
  try {
    const queryText = `
      UPDATE reviews
      SET helpfulness = helpfulness + 1
      WHERE id = $1;
    `;
    await pool.query(queryText, [id]);
    res.status(200).send('Helpfulness updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.put('/reviews/:review_id/report', async (req, res) => {
  const id = req.params.review_id;
  try {
    const queryText = `
      UPDATE reviews
      SET reported = true
      WHERE id = $1;
    `;
    await pool.query(queryText, [id]);
    res.status(200).send('Reported updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;