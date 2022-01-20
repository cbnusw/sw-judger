const { NOT_FOUND } = require('./');

const notFound = (req, res, next) => next(NOT_FOUND);
const errorHandler = (errorLogger) => (err, req, res, next) => {
  const status = err.status || 500;
  const code = err.code || 'SERVER_ERROR';

  const response = {
    success: false,
    status,
    code,
    message: err.message
  };

  errorLogger(`${err.status} - ${err.message}`);
  console.error(err);
  res.status(status).json(response);
};

exports.notFound = notFound;
exports.errorHandler = errorHandler;
