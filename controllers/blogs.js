const blogsRouter = require('express').Router();

const Blog = require('../models/blog');

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogsRouter.post('/', (request, response) => {
  const newBlog = new Blog(request.body);

  newBlog.save().then((savedBlog) => {
    response.status(201).json(savedBlog);
  });
});

module.exports = blogsRouter;
