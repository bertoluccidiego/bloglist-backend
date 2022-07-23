const bcrypt = require('bcrypt');

const { ValidationError, RegistrationError } = require('../utils/errors');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  });
  response.json(users);
});

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (!(password && password.length >= 3)) {
    throw new ValidationError('password missing or invalid');
  }

  const userExists = await User.findOne({ username });
  if (userExists) {
    throw new RegistrationError('username already taken');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await newUser.save();
  response.status(201).json(savedUser);
});

module.exports = usersRouter;
