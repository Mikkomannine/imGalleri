// AWS Lambda entry point (Function URL). Local development still uses server.js.
const serverless = require("serverless-http");
const app = require("./app");
const connectDB = require("./config/db");

const expressHandler = serverless(app);

module.exports.handler = async (event, context) => {
  await connectDB();
  return expressHandler(event, context);
};
