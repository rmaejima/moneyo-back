const router = require('express').Router();
const AWS = require('../../utils/aws.js');
const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = 'MoneyoSleepTime';

router.post('/', (req, res) => {
    const response = {
        stateCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "" }),
    };

    const body = req.body;
    console.log(req.body)
    
    //DBに登録するための情報の宣言
    const param = {
        TableName: tableName,
        Item: {
            userId: body.userId,
            bedTime: body.bedTime,
        },
    };
    console.log(param)
    
    //DynamoDBにデータを登録
    dynamo.put(param, function (err, data) {
        if (err) {
          //登録に失敗した場合の処理
          console.log(err);
          res.statusCode = 500;
          res.send({
            message: "予期せぬエラーが発生しました",
          });
          return;
        } else {
          //登録に成功した場合の処理
          res.send({
            message: "OK",
          });
          return;
        }
    });
});

module.exports = router;