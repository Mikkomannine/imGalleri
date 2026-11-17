const mongoose = require("mongoose");

// Treat objects in query filters as literal values ({ $ne: null } in a request
// body can no longer become a query operator). Filters that intentionally use
// operators must wrap them in mongoose.trusted().
mongoose.set("sanitizeFilter", true);

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
