const jwt = require('jsonwebtoken');

const { AuthorizationError } = require('../utils/errors');
const blogsRouter = require('express').Router();

const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const { user } = request;

  if (!user) {
    throw new AuthorizationError('token missing or invalid');
  }

  const newBlog = new Blog({
    ...request.body,
    user: user._id,
  });

  const savedBlog = await newBlog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  const { user } = request;

  const blog = await Blog.findById(request.params.id);

  if (user._id.toString() !== blog.user.toString()) {
    throw new AuthorizationError("logged-in user isn't the owner of the blog");
  }

  user.blogs = user.blogs.filter((b) => b.toString() === blog._id.toString());
  await user.save();

  await Blog.findByIdAndRemove(blog._id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const { user } = request;

  if (!user) {
    throw new AuthorizationError('token missing or invalid');
  }

  const modifiedBlog = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { ...modifiedBlog },
    { new: true, runValidators: true, context: 'query' }
  ).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  });

  response.json(updatedBlog);
});

module.exports = blogsRouter;
