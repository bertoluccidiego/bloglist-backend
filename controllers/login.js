const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const loginRouter = require('express').Router();

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;
  const user = await User.findOne({ username });

  const passwordCorrect =
    user !== null ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!(user && passwordCorrect)) {
    return response.status(401).json({ error: 'invalid username or password' });
  }

  const objForToken = {
    username: user.username,
    id: user._id,
  };

  const userToken = jwt.sign(objForToken, process.env.SECRET);
  response.json({ username: user.username, name: user.name, userToken });
});

module.exports = loginRouter;
