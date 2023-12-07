const express = require('express');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000;

const pool = new Pool({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: false
});

app.use(express.json());
app.use(express.static(path.join(__dirname, './public/dist')));

app.get('/reviews/meta', async (req, res) => {
  try {
    const productId = 40344;

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

app.get('/reviews', async (req, res) => {
  const id = "40344"
  try {
    const queryText = `SELECT * FROM reviews WHERE product_id=${id};`;
    const response = await pool.query(queryText);
    res.json(response.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log('Listening on port: ', port);
});
