const AWS = require('./awsConfig');

const s3 = new AWS.S3();

function uploadFileToS3(file) {

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  return s3.upload(params).promise();
}

module.exports = uploadFileToS3;