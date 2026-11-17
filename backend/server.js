const app = require('./app');
const http = require('http');
const logger = require('./utils/logger');
const connectDB = require('./config/db');

const server = http.createServer(app);
const port = process.env.PORT;

connectDB()
  .then(() => {
    server.listen(port, () => {
      logger.info(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });
