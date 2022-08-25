const router = require('express').Router();
const AWS = require('../../../utils/aws.js');
const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = 'User';

router.get('/', (req, res) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ message: '' }),
  };

  //TODO: 取得したいテーブル名をparamオブジェクトに設定する（中身を記述）
  const param = {
    TableName: tableName,
  };

  //dynamo.scan()で全件取得
  dynamo.scan(param, function (err, data) {
    if (err) {
      console.log(err);
      response.statusCode = 500;
      response.body = JSON.stringify({
        message: '予期せぬエラーが発生しました',
        err: err,
      });
      res.send(response);
      return;
    }

    //TODO: 全ユーザのpasswordを隠蔽する処理を記述
    const items = data.Items;
    if (items) {
      items.forEach((item) => delete item.password);
    }

    //TODO: レスポンスボディの設定とコールバックの記述
    response.body = { users: items };
    res.send(response);
  });
});

module.exports = router;
