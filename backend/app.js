require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const customMiddleware = require("./middleware/customMiddleware");
const mediaRouter = require("./routers/mediaRouter");
const userRouter = require("./routers/userRouter");

// express app
const app = express();

connectDB();

if (!process.env.CORS_ORIGINS) {
	throw new Error("CORS_ORIGINS environment variable is not set");
}

const allowedOrigins = process.env.CORS_ORIGINS.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

// middleware
app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				return callback(null, true);
			}

			return callback(new Error("Not allowed by CORS"));
		},
	})
);
app.use(express.json());

app.use(customMiddleware.requestLogger);

app.get("/", (req, res) => res.send("API Running!"));

app.use("/api/media", mediaRouter);
app.use("/api/users", userRouter);

app.use(customMiddleware.unknownEndpoint);
app.use(customMiddleware.errorHandler);

module.exports = app;