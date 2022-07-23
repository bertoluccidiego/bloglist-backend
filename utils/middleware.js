const jwt = require('jsonwebtoken');

const { AuthorizationError } = require('./errors');
const logger = require('./logger');

const User = require('../models/user');

async function userExtractor(request, response, next) {
  const authorization = request.get('Authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.slice(7);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.id) {
      throw new AuthorizationError('token missing or invalid');
    }

    request.user = await User.findById(decodedToken.id);
  }

  next();
}

function unknownEndpoint(request, response, next) {
  response.status(404).json({ error: 'unknown endpoint' });
}

function errorHandler(error, request, response, next) {
  logger.error(error.name);
  logger.error(error.message);

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  if (
    error.name === 'AuthorizationError' ||
    error.name === 'JsonWebTokenError'
  ) {
    return response.status(401).json({ error: error.message });
  }

  next(error);
}

module.exports = {
  userExtractor,
  unknownEndpoint,
  errorHandler,
};
