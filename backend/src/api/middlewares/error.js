const httpStatus = require('http-status');
const expressValidation = require('express-validation');
const APIError = require('../utils/error');


const handler = (err, req, res, next) => {
  let apiError = err;
  
  if (err instanceof expressValidation.ValidationError) {
    apiError = new APIError({
      message: 'Validation Error',
      errors: err.details,
      status: err.statusCode,
    });
  } else if (!(err instanceof APIError)) {
    apiError = new APIError({
      message: err.message,
      status: err.status,
    });
  }

  const response = {
    code: apiError.status,
    message: apiError.message || httpStatus[apiError.status],
    errors: apiError.errors,
  };

  res.status(apiError.status);
  res.json(response);
};
exports.handler = handler;

exports.notFound = (req, res, next) => {
  const err = new APIError({
    message: 'Not found',
    status: httpStatus.NOT_FOUND,
  });
  return handler(err, req, res);
};
