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

router.get('/:userId', (req, res) => {
  
  const userId = req.params.userId;

  //DBから値を取得するためのKeyの宣言
  const user_idealWakeUpTime_params = {
    TableName: 'MoneyoIdealSleepTime',
    Key: { userId },
  };
  const user_actWakeUpTime_params = {
    TableName: 'MoneyoSleepTime',
    Key: { userId },
  }
  
  const run = async () => {
    try {
      //DynamoDBからデータを取得
      const user_idealWakeUpTime = await dynamo.get(user_idealWakeUpTime_params).promise();
      const user_actWakeUpTime = await dynamo.get(user_actWakeUpTime_params).promise();

      // validation
      if (
        !user_idealWakeUpTime.Item ||
        !user_actWakeUpTime.Item
      ) {
        res.status = 400;
        const user_idealWakeUpTime_lack = user_idealWakeUpTime.Item ? '' : 'user_idealWakeUpTime';
        const user_actWakeUpTime_lack = user_actWakeUpTime.Item ? '' : 'user_actWakeUpTime';
        res.send({
          message:
            user_idealWakeUpTime_lack +
            user_actWakeUpTime_lack +
            'のデータが存在しません。',
        });
        return;
      }

      const idealWakeUpTime = new Date(user_idealWakeUpTime.Item.wakeUpTime);
      const actWakeUpTime = new Date(user_actWakeUpTime.Item.wakeUpTime);
      const diffWakeUpTime = new Date(idealWakeUpTime.getTime() - actWakeUpTime.getTime()) / (60*60*1000);
      const addExperiencePoint = 10 - diffWakeUpTime * 5

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