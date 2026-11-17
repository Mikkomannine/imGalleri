const multer = require("multer");
const { ALLOWED_IMAGE_TYPES } = require("../config/s3");

// Lambda Function URLs accept at most 6 MB per request and binary bodies are
// base64-encoded (+33 %), so 4 MB is the largest image that reliably fits.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

// The client-supplied MIME type is not trusted on its own: the file's first
// bytes must match the declared image format.
const SIGNATURES = {
  "image/jpeg": (b) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  "image/png": (b) => b.length > 8 && b.toString("hex", 0, 8) === "89504e470d0a1a0a",
  "image/gif": (b) => b.length > 6 && b.toString("ascii", 0, 4) === "GIF8",
  "image/webp": (b) =>
    b.length > 12 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP",
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_BYTES, files: 1, fields: 10 },
  fileFilter: (req, file, cb) => cb(null, ALLOWED_IMAGE_TYPES.includes(file.mimetype)),
});

// Accepts exactly one image in `fieldName`; responds 400 for anything else.
const uploadImage = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (err) {
      const error =
        err.code === "LIMIT_FILE_SIZE" ? "Image is too large (max 4 MB)" : "Invalid upload";
      return res.status(400).json({ error });
    }
    if (!req.file) {
      return res.status(400).json({ error: "An image file (JPEG, PNG, GIF or WebP) is required" });
    }
    if (!SIGNATURES[req.file.mimetype](req.file.buffer)) {
      return res.status(400).json({ error: "File content does not match its image type" });
    }
    next();
  });
};

module.exports = uploadImage;
