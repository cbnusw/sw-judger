require('dotenv').config()

const {
  PM2_AUTH_APP_INSTANCE: INSTANCE,
  PM2_AUTH_APP_EXEC_MODE: EXEC_MODE,
} = process.env;

const instance = +(INSTANCE || 1);
const execMode = EXEC_MODE || undefined;

module.exports = require('./pm2')('auth-app', 'auth/index.js', instance, execMode);
