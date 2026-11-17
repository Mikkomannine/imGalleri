const crypto = require("crypto");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Credentials come from the SDK's default provider chain:
// - locally: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY in .env
// - on Lambda: the function's execution role
const s3 = new S3Client({ region: process.env.S3_REGION || "eu-north-1" });

const IMAGE_EXTENSIONS = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
};

const SIGNED_URL_TTL_SECONDS = 60 * 5;

const bucket = () => process.env.AWS_BUCKET_NAME;

// The key is generated server-side; the client's original filename is never used.
const uploadFileToS3 = async (file) => {
  const key = `${Date.now()}_${crypto.randomUUID()}${IMAGE_EXTENSIONS[file.mimetype] || ""}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );
  return key;
};

const generateSignedUrl = (key) =>
  getSignedUrl(s3, new GetObjectCommand({ Bucket: bucket(), Key: key }), {
    expiresIn: SIGNED_URL_TTL_SECONDS,
  });

const deleteFileFromS3 = (key) =>
  s3.send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));

module.exports = {
  ALLOWED_IMAGE_TYPES: Object.keys(IMAGE_EXTENSIONS),
  uploadFileToS3,
  generateSignedUrl,
  deleteFileFromS3,
};
