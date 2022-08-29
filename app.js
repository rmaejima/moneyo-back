const express = require('express');
const testRouter = require('./routes/test/index.js');
const bedinRouter = require('./routes/bedin/index.js');
const wakeupRouter = require('./routes/wakeup/index.js');
const sleepRouter = require('./routes/sleep/index.js');
const idealsleepRouter = require('./routes/idealsleep/index.js');
const userRouter = require('./routes/user/index.js');
const castleRouter = require('./routes/castle/index.js');

const cors = require('cors');
const app = express();
const port = 8081;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  return res.send('Hello');
});

app.use('/test', testRouter);
app.use('/bedin', bedinRouter);
app.use('/wakeup', wakeupRouter);
app.use('/sleep', sleepRouter);
app.use('/castle', castleRouter);
app.use('/idealsleep', idealsleepRouter);
app.use('/user', userRouter);
module.exports = app;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
