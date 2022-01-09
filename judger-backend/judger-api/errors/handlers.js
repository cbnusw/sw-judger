const { NOT_FOUND } = require('./');
const { error } = require('../utils/logger');

const notFound = (req, res, next) => next(NOT_FOUND);
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const code = err.code || 'SERVER_ERROR';

  const response = {
    success: false,
    status,
    code,
    message: err.message
  };

  error(`${err.status} - ${err.message}`);
  console.error(err);
  res.status(status).json(response);
};

exports.notFound = notFound;
exports.errorHandler = errorHandler;
