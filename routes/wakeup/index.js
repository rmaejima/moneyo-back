const router = require('express').Router();
const AWS = require('../../utils/aws.js');
const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = 'MoneyoSleepTime';

router.put('/', (req, res) => {
  
  const body = req.body;
  console.log(body)
  
  //DBを更新するための情報の宣言
  const param = {
    TableName: tableName,
    Key: {
      userId: body.userId,
    },
    ExpressionAttributeNames: {
      '#w': 'wakeUpTime',
    },
    ExpressionAttributeValues: {
      ':newWakeUpTime': body.wakeUpTime,//wakeUpを更新する
    },
    UpdateExpression: 'SET #w = :newWakeUpTime'
  };
  
  //DynamoDBにデータを登録
  dynamo.update(param, function (err, data) {
    if (err) {
      //更新に失敗した場合の処理
      console.log(err);
      res.statusCode = 500;
      res.send({
        message: "予期せぬエラーが発生しました",
      });
      return;
    } else {
      //更新に成功した場合の処理
      res.send({
        message: "起床時間を更新しました",
      });
      return;
    }
  });
});

module.exports = router;