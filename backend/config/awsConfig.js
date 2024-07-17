const AWS = require('aws-sdk');

// Configure AWS with your access and secret key.
AWS.config.update({
  accessKeyId: 'AKIAXYKJRO26XOJ6ZTDE',
  secretAccessKey: 'CNk+IBYiCVXBN+qhTOt6/9HEKdtF3UBNFC6jlUtT',
  region: 'eu-north-1' // Example: 'us-west-2'
});

module.exports = AWS;
//AKIAXYKJRO26XOJ6ZTDE,CNk+IBYiCVXBN+qhTOt6/9HEKdtF3UBNFC6jlUtT