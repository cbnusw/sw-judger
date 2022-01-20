const { join } = require('path');
require('dotenv').config();

module.exports = {
  ...process.env,
  ROOT_DIR: join(__dirname, '../..'),
  IS_DEV: process.env.NODE_ENV === 'development',
};
