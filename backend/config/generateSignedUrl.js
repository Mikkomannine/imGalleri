const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const generateSignedUrl = (fileKey) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: 'myappfileuploadbucket', // Your S3 Bucket name
            Key: fileKey,
            Expires: 60 * 5 // URL expires in 5 minutes
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