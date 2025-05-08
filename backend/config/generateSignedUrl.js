const AWS = require('aws-sdk');
const s3 = new AWS.S3();


const generateSignedUrl = (fileKey) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
            Expires: 60 * 5
        };
        s3.getSignedUrl('getObject', params, (err, url) => {
            if (err) {
                reject(err);
            } else {
                resolve(url);
            }
        });
    });
};

module.exports = generateSignedUrl;