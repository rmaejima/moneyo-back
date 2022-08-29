const express = require('express');
const bedinRouter = require('./routes/bedin/index.js');
const wakeupRouter = require('./routes/wakeup/index.js');
const sleepRouter = require('./routes/sleep/index.js');
const idealsleepRouter = require('./routes/idealsleep/index.js');

const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  return res.send('Hello');
});

app.use('/bedin', bedinRouter);
app.use('/wakeup', wakeupRouter);
app.use('/sleep', sleepRouter);
app.use('/idealsleep', idealsleepRouter);
module.exports = app;
