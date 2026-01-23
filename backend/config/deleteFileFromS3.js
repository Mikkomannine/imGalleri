const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const deleteFileFromS3 = async (key) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
    };
    return s3.deleteObject(params).promise();
};

module.exports = deleteFileFromS3;
