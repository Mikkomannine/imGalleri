const mongoose = require("mongoose");

// Cache the connection promise so warm Lambda invocations reuse the same
// connection instead of opening a new one on every request.
let connectionPromise = null;

const connectDB = () => {
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }
  return connectionPromise;
};

module.exports = connectDB;
