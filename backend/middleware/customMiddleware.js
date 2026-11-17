const SENSITIVE_FIELD_PATTERN =
  /password|pass|token|secret|authorization|api[-_]?key|refresh[-_]?token|access[-_]?token/i;
const isProduction = process.env.NODE_ENV === "production";

const redactSensitiveData = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => redactSensitiveData(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => {
        if (SENSITIVE_FIELD_PATTERN.test(key)) {
          return [key, "[REDACTED]"];
        }

        return [key, redactSensitiveData(val)];
      })
    );
  }

  return value;
};

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);

  if (!isProduction) {
    console.log("Body:  ", redactSensitiveData(request.body));
  }

  console.log("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// Client errors raised by express.json() keep their status; everything else is
// logged server-side and returned as a generic 500 without internal details.
const errorHandler = (error, request, response, next) => {
  if (error.type === "entity.parse.failed") {
    return response.status(400).json({ error: "Malformed JSON body" });
  }
  if (error.type === "entity.too.large") {
    return response.status(413).json({ error: "Request body too large" });
  }

  console.error(error);
  response.status(500).json({ error: "Server Error" });
};

// Shared 500 response for controllers' catch blocks.
const serverError = (response, error) => {
  console.error(error);
  return response.status(500).json({ error: "Server Error" });
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  serverError,
};