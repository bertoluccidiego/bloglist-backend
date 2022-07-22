function tokenExtractor(request, response, next) {
  const authorization = request.get('Authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.slice(7);
  }

  next();
}

module.exports = {
  tokenExtractor,
};
