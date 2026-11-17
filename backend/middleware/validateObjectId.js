// router.param handler: rejects route ids that are not 24-char hex ObjectIds
// before they reach a database query (avoids CastErrors surfacing as 500s).
const OBJECT_ID_PATTERN = /^[a-f0-9]{24}$/i;

const validateObjectId = (req, res, next, value) => {
  if (!OBJECT_ID_PATTERN.test(value)) {
    return res.status(400).json({ error: "Invalid id" });
  }
  next();
};

module.exports = validateObjectId;
