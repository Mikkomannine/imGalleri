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

// middleware
app.use(cors());
app.use(express.json());

app.use(customMiddleware.requestLogger);

app.get("/", (req, res) => res.send("API Running!"));

app.use("/api/media", mediaRouter);
app.use("/api/users", userRouter);

app.use(customMiddleware.unknownEndpoint);
app.use(customMiddleware.errorHandler);

module.exports = app;