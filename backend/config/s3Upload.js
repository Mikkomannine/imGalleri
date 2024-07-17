const AWS = require('./awsConfig'); // Import the AWS configuration

const s3 = new AWS.S3();

function uploadFileToS3(file) {
    // Validate the file object
    /*if (!file || !file.originalname || !file.buffer || !file.mimetype) {
        throw new Error('Invalid file object. Ensure it has originalname, buffer, and mimetype properties.');
      }*/
  const params = {
    Bucket: 'myappfileuploadbucket',
    Key: `${Date.now()}_${file.originalname}`, // Use Date.now() to ensure unique filenames
    Body: file.buffer,
    ContentType: file.mimetype,
    //ACL: 'public-read' // Make file publicly accessible
  };

  return s3.upload(params).promise();
}

module.exports = uploadFileToS3;