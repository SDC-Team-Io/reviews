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

app.get('/characteristics', async (req, res) => {
  try {
    const queryText = "SELECT char_reviews.characteristic_id, value, name FROM char_reviews INNER JOIN (SELECT * FROM characteristics WHERE product_id = 5) AS char_query ON char_reviews.characteristic_id = char_query.characteristic_id;";
    const response = await pool.query(queryText);
    res.json(response.rows);
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
