const express = require('express');
const path = require('path');
const router = require('./routes/router');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/', router);
app.use(express.static(path.join(__dirname, './public/dist')));

app.listen(port, () => {
  console.log('Listening on port: ', port);
});
