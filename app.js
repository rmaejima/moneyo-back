const express = require('express');
const testRouter = require('./routes/test/index.js');
const bedInRouter = require('./routes/bedIn/index.js')

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  return res.send('Hello');
});

app.use('/test', testRouter);
app.use('/bedIn', bedInRouter);
module.exports = app;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
