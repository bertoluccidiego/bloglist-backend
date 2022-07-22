const jwt = require('jsonwebtoken');

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

module.exports = {
  userExtractor,
};
