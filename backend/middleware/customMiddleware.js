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

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  response.status(500);
  response.json({
    message: error.message,
  });
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};