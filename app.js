const express = require('express');
const testRouter = require('./routes/test/index.js');

const app = express();

app.get('/', (req, res) => {
  return res.send('Hello');
});

app.use('/test', testRouter);
module.exports = app;
