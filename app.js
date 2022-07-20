const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./utils/config');
const logger = require('./utils/logger');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error(`Error trying to connect with MongoDB: ${error}`);
  });

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);

module.exports = app;
