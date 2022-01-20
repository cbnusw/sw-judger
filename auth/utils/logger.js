const { AUTH_APP_LOG_DIR: LOG_DIR } = require('../shared/env');

module.exports = require('../shared/utils/logger')(LOG_DIR);
