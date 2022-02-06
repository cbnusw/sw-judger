require('dotenv').config()

const {
  PM2_API_APP_INSTANCE: INSTANCE,
  PM2_API_APP_EXEC_MODE: EXEC_MODE,
} = process.env;

const instance = +(INSTANCE || 1);
const exec_mode = EXEC_MODE || undefined;

module.exports = { apps: [{ name: 'judger-api', script: 'index.js', instance, exec_mode }] };
