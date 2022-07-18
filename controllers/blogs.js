const blogsRouter = require('express').Router();

const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  if (!request.body.title && !request.body.url) {
    return response.status(400).json({ error: 'title and url are missing' });
  }

  const newBlog = new Blog(request.body);

  const savedBlog = await newBlog.save();
  response.status(201).json(savedBlog);
});

module.exports = blogsRouter;
