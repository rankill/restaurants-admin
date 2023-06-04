const httpStatus = require('http-status');

class ExtendableError extends Error {
  constructor({
    message, errors, status,
  }) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errors = errors;
    this.status = status;
  }
}

class APIError extends ExtendableError {
  constructor({
    message,
    errors,
    status = httpStatus.INTERNAL_SERVER_ERROR,
  }) {
    super({
      message, errors, status,
    });
  }
}

module.exports = APIError;
