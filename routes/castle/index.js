const router = require('express').Router();
const AWS = require('../../utils/aws.js');
const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = 'MoneyoCastle';

router.get('/:userId', (req, res) => {
  
  const userId = req.params.userId;
  console.log(userId);
  
  //DBに登録するための情報の宣言
  const param = {
    TableName: tableName,
    Key: {
      userId: userId
    },
  };
  
  //DynamoDBにデータを取得
  dynamo.get(param, function (err, data) {
    if (err) {
      //取得に失敗した場合の処理
      console.log(err);
      res.statusCode = 500;
      res.send({
        message: "予期せぬエラーが発生しました",
      });
      return;
    }

    const item = data.Item;
    console.log(item)
    res.send({
      item,
    });
  });
});

module.exports = router;