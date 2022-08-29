const express = require('express');
const testRouter = require('./routes/test/index.js');
const bedinRouter = require('./routes/bedin/index.js');
const wakeupRouter = require('./routes/wakeup/index.js');
const sleepRouter = require('./routes/sleep/index.js');
const castleRouter = require('./routes/castle/index.js');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  return res.send('Hello');
});

app.use('/test', testRouter);
app.use('/bedin', bedinRouter);
app.use('/wakeup', wakeupRouter);
app.use('/sleep', sleepRouter);
app.use('/castle', castleRouter);
module.exports = app;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
