const { rateLimit } = require("express-rate-limit");

// In-memory counters per process. On Lambda each warm instance keeps its own
// counters, so limits are per instance - good enough to stop brute force and
// casual abuse in a small project without adding a shared store.
//
// Client IP: on Lambda serverless-http sets the socket address from the Function
// URL's requestContext.http.sourceIp (set by AWS, not the client), and Express
// does not trust X-Forwarded-For, so req.ip cannot be spoofed via headers.
const baseOptions = {
  standardHeaders: "draft-8",
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: { error: "Too many requests, please try again later." },
};

// All API traffic. Generous, because the frontend makes several calls per page.
const apiLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: 1000,
});

// Login / signup / password reset: failed attempts only, to slow down guessing.
const authLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
});

// Every request sends an email, so keep this tight.
const passwordResetEmailLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 60 * 1000,
  limit: 5,
});

module.exports = { apiLimiter, authLimiter, passwordResetEmailLimiter };
