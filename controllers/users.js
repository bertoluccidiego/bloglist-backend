const bcrypt = require('bcrypt');

const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (!(password && password.length >= 3)) {
    return response.status(400).json({ error: 'password missing or invalid' });
  }

  const userExists = await User.findOne({ username });
  if (userExists) {
    return response.status(409).json({ error: 'username already taken' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    name,
    passwordHash,
  });

  try {
    const savedUser = await newUser.save();
    response.status(201).json(savedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message });
    }
  }
});

module.exports = usersRouter;
