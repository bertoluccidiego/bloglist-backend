class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class RegistrationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RegistrationError';
  }
}

module.exports = {
  AuthorizationError,
  ValidationError,
  RegistrationError,
};
