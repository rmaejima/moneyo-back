const router = require('express').Router();
const testUsersRouter = require('./users/index.js');

router.use('/users', testUsersRouter);

router.get('/', (req, res) => {
  res.send('テスト');
});

module.exports = router;
