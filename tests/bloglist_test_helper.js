const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'blog 1',
    author: 'author 1',
    url: 'url1 1',
    likes: 10,
  },
  {
    title: 'blog 2',
    author: 'author 2',
    url: 'url1 2',
    likes: 10,
  },
];

async function blogsInDb() {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
}

module.exports = {
  initialBlogs,
  blogsInDb,
};
