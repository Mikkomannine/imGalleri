const AWS = require('aws-sdk');

// Credentials come from the SDK's default provider chain:
// - locally: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY in .env
// - on Lambda: the function's execution role (temporary credentials)
AWS.config.update({
  region: process.env.S3_REGION || 'eu-north-1'
});

module.exports = AWS;
