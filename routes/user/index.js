const router = require('express').Router();
const AWS = require('../../utils/aws.js');
const dynamo = new AWS.DynamoDB.DocumentClient();

router.get('/:userId', (req, res, next) => {
  const userId = req.params.userId;
  // get user information
  const user_get_params = {
    TableName: 'MoneyoUser',
    Key: { userId },
  };
  const user_level_params = {
    TableName: 'MoneyoUserLevel',
    Key: { userId },
  };
  user_get_sleep_params = {
    TableName: 'MoneyoIdealSleepTime',
    Key: { userId },
  };
  user_get_castle_params = {
    TableName: 'MoneyoCastle',
    Key: { userId },
  };

  const run = async () => {
    try {
      const user = await dynamo.get(user_get_params).promise();
      const user_level = await dynamo.get(user_level_params).promise();
      const user_sleep = await dynamo.get(user_get_sleep_params).promise();
      const user_castle = await dynamo.get(user_get_castle_params).promise();

      // validation
      if (
        !user.Item ||
        !user_level.Item ||
        !user_sleep.Item ||
        !user_castle.Item
      ) {
        res.status = 400;
        const user_lack = user.Item ? '' : 'user ';
        const user_level_lack = user_level.Item ? '' : 'user_level ';
        const user_sleep_lack = user_sleep.Item ? '' : 'user_sleep ';
        const user_castle_lack = user_castle.Item ? '' : 'user_castle ';
        res.send({
          message:
            user_lack +
            user_level_lack +
            user_sleep_lack +
            user_castle_lack +
            'のデータが存在しません。',
        });
        return;
      }

      // make body
      const body = {
        userId: user.Item.userId,
        name: user.Item.name,
        level: user_level.Item.level,
        experiencePoint: user_level.Item.experiencePoint,
        experiencePointToNextLevel: user_level.Item.experiencePointToNextLevel,
        bedTime: user_sleep.Item.bedTime,
        wakeUpTime: user_sleep.Item.wakeUpTime,
        castlePoint: user_castle.Item.point,
        castleName: user_castle.Item.name,
      };

      console.log(body);
      res.status = 200;
      res.send(body);
    } catch (err) {
      console.log(err);
      res.status = 400;
      res.send({ message: err });
    }
  };
  run();
});

module.exports = router;
