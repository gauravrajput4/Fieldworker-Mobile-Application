const app = require('./src/app');
const connectDB = require('./src/config/db');
const logger = require('./src/config/logger');
const { port } = require('./src/config/env');

connectDB();

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
