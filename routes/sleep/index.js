const router = require('express').Router();
const AWS = require('../../utils/aws.js');
const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = 'MoneyoSleepTime';

router.post('/', (req, res) => {
    //リクエストボディの内容をオブジェクトに変換
    const body = req.body;

    //リクエストボディの内容をコンソールに記述して確認
    console.log(body);

    //bedTime, wakeUpTime どちらかがなければエラーを返す
    if (!body.bedTime || !body.wakeUpTime) {
        res.statusCode = 400;
        res.send({
            message: "bedTime or wakeUpTimeが抜けています"
        });
        return;
    }

    //DBに登録するための情報をparamオブジェクトとして作る
    const param = {
        TableName: tableName,
        Item: {
            userId: body.userId,
            bedTime: body.bedTime,
            wakeUpTime: body.wakeUpTime,
        }
    };

    //dynamo.put()でDBにデータを登録
    dynamo.put(param, function (err, data) {
        if (err) {
            res.statusCode = 500;
            res.send({
                message: "予期せぬエラーが発生しました",
            });
            return;
        } else {
            //登録に成功した場合の処理を記述
            res.send({
                message: "bedTime, wakeUpTimeの登録が完了しました"
            });
            return;
        }
    });
});

router.get('/:userId', (req, res) => {
    //見たいユーザのuserId
    const userId = req.params.userId;
    console.log(userId);

    //取得対象のテーブル名と検索に使うキーをparamに宣言
    const param = {
        TableName: tableName,
        Key: {
            userId: userId
        }
    };
    console.log(param);

    //dynamo.get()でDBからデータを取得
    dynamo.get(param, function (err, data) {
        //エラー処理
        if (err) {
            res.statusCode = 500;
            res.send({
                message: "予期せぬエラーが発生しました"
            });
            return;
        }

        //検索結果の内容をitemに格納
        const item = data.Item;
        console.log(item);

        //itemをレスポンスボディに入れて返す
        res.send({
            item
        })

        return;
    });
});

module.exports = router;
