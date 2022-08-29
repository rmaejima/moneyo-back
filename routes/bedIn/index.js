const router = require('express').Router();
const AWS = require('../../utils/aws.js');
const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = 'MoneyoSleepTime';

router.post('/', (req, res) => {
  
  const body = req.body;
  console.log(body)
    
  //DBに登録するための情報の宣言
  const param = {
    TableName: tableName,
    Item: {
      userId: body.userId,
      bedTime: body.bedTime,
    },
  };
  
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
        message: "DBに就寝時間を登録しました",
      });
      return;
    }
  });
});

router.get('/:userId', (req, res) => {
  
  const userId = req.params.userId;

  //DBから値を取得するためのKeyの宣言
  const user_idealBedTime_params = {
    TableName: 'MoneyoIdealSleepTime',
    Key: { userId },
  };
  const user_actBedTime_params = {
    TableName: 'MoneyoSleepTime',
    Key: { userId },
  }
  
  const run = async () => {
    try {
      //DynamoDBからデータを取得
      const user_idealBedTime = await dynamo.get(user_idealBedTime_params).promise();
      const user_actBedTime = await dynamo.get(user_actBedTime_params).promise();

      // validation
      if (
        !user_idealBedTime.Item ||
        !user_actBedTime.Item
      ) {
        res.status = 400;
        const user_idealBedTime_lack = user_idealBedTime.Item ? '' : 'user_idealBedTime';
        const user_actBedTime_lack = user_actBedTime.Item ? '' : 'user_actBedTime';
        res.send({
          message:
            user_idealBedTime_lack +
            user_actBedTime_lack +
            'のデータが存在しません。',
        });
        return;
      }

      const idealBedTime = new Date(user_idealBedTime.Item.bedTime);
      const actBedTime = new Date(user_actBedTime.Item.bedTime);
      const diffBedTime = new Date(idealBedTime.getTime() - actBedTime.getTime()) / (60*60*1000);
      const addExperiencePoint = 10 - Math.abs(diffBedTime) * 5

      //DBから値を取得するためのKeyの宣言
      const user_addExperiencePoint_params = {
        TableName: 'MoneyoUserLevel',
        Key: { userId },
        ExpressionAttributeNames: {
          '#ep': 'experiencePoint',
        },
        ExpressionAttributeValues: {
          ':addExperiencePoint': addExperiencePoint,//experiencePointに加算する
        },
        UpdateExpression: 'SET #ep = #ep + :addExperiencePoint'
      };
      
      //DynamoDBにデータを登録
      await dynamo.update(user_addExperiencePoint_params).promise();

      res.status = 200;
      res.send({ message : "正常に処理が終了しました" });
    }catch (err) {
      console.log(err);
      res.status = 400;
      res.send({ message: err })
    }
  };
  run();
});

module.exports = router;