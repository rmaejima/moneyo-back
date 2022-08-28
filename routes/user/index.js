const router = require('express').Router();
const AWS = require('../../utils/aws.js');
const dynamo = new AWS.DynamoDB.DocumentClient();
const userTableName = 'MoneyoUser';

router.get('/:userId', (req, res, next) => {
  // userId からuserの名前を取得
  const userId = req.params.userId;
  const params = {
    TableName: userTableName,
    Key: {
      userId: userId,
    },
  };

  dynamo.get(params, function (err, data) {
    if (err) {
      console.log(err);
      const body = { message: '予期せぬエラーが発生しました', err: err };
      res.status = 500;
      res.send(body);
      return;
    }
    const item = data.Item;

    if (!item) {
      const body = { message: 'User データがありません', item: item };
      res.status = 400;
      res.send(body);
      return;
    }
    res.status = 400;
    res.send(item);
    return;
  });
});

module.exports = router;
