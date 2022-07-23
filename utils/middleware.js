const jwt = require('jsonwebtoken');

const logger = require('./logger');

const User = require('../models/user');

async function userExtractor(request, response, next) {
  const authorization = request.get('Authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.slice(7);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    request.user = await User.findById(decodedToken.id);

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' });
    }
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
