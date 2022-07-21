const jwt = require('jsonwebtoken');

const blogsRouter = require('express').Router();

const Blog = require('../models/blog');
const User = require('../models/user');

function getToken(request) {
  const authorization = request.get('Authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.slice(7);
  }
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const token = getToken(request);
  const unencryptedToken = jwt.verify(token, process.env.SECRET);

  if (!unencryptedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(unencryptedToken.id);

  if (!request.body.title && !request.body.url) {
    return response.status(400).json({ error: 'title and url are missing' });
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
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const modifiedBlog = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { ...modifiedBlog },
    { new: true, runValidators: true, context: 'query' }
  );

  response.json(updatedBlog);
});

module.exports = blogsRouter;
