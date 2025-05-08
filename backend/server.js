const app = require('./app');
const http = require('http');
const logger = require('./utils/logger');

const server = http.createServer(app);
const port = process.env.PORT;

server.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
