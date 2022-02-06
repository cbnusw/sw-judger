const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cors = require('cors');
const { IS_DEV } = require('../env');

module.exports = (app, staticOptions) => {
  const logDir = app.get('logDir');
  const { stream } = require('../utils/logger')(logDir);

  app.use(helmet());
  app.use(compression());

  app.use(morgan(IS_DEV ? 'dev' : 'combined', { stream }));
  app.use(cors());
  if (staticOptions) staticOptions.forEach(options => app.use(...options));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};
