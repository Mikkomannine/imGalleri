require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const customMiddleware = require("./middleware/customMiddleware");
const { apiLimiter } = require("./middleware/rateLimit");
const mediaRouter = require("./routers/mediaRouter");
const userRouter = require("./routers/userRouter");

// express app
const app = express();

if (!process.env.CORS_ORIGINS) {
	throw new Error("CORS_ORIGINS environment variable is not set");
}

const allowedOrigins = process.env.CORS_ORIGINS.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

// middleware
app.use(helmet());
app.use(
	cors({
		// Unknown origins get no CORS headers (the browser blocks the response)
		// instead of a 500 error. Requests without an Origin header (curl,
		// server-to-server) are not subject to CORS at all.
		origin: (origin, callback) => callback(null, !origin || allowedOrigins.includes(origin)),
		methods: ["GET", "POST", "PATCH", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
		maxAge: 600,
	})
);
app.use(express.json({ limit: "100kb" }));

app.use(customMiddleware.requestLogger);

app.get("/", (req, res) => res.send("API Running!"));

app.use("/api", apiLimiter);
app.use("/api/media", mediaRouter);
app.use("/api/users", userRouter);

app.use(customMiddleware.unknownEndpoint);
app.use(customMiddleware.errorHandler);

module.exports = app;
