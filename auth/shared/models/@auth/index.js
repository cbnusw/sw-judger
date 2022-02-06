const { join } = require('path');
const { MONGO_AUTH_DB_URL: URL, MONGO_AUTH_DB_POOL_SIZE: POOL_SIZE } = require('../../env');
const createDB = require('../common/create-db');
const options = require('../common/connection-options');

const models = createDB(URL, join(__dirname, 'schemas'), {
  poolSize: +(POOL_SIZE || 1),
  ...options
});

module.exports = models;
