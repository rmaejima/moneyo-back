const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-northeast-1' });

module.exports = AWS;
