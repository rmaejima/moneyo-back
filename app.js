const express = require('express');
const testRouter = require('./routes/test/index.js');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  return res.send('Hello');
});

app.use('/test', testRouter);
module.exports = app;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
