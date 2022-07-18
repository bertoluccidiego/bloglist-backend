const supertest = require('supertest');
const mongoose = require('mongoose');

const Blog = require('../models/blog');
const app = require('../app');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();
});

test('the correct amount of blogs is fetched', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(response.body).toHaveLength(2);
});

test('a blog has an id property', async () => {
  const response = await api.get('/api/blogs');

  const blogToVerify = response.body[0];
  expect(blogToVerify.id).toBeDefined();
}, 10000);

test('a new blog post is correctly added', async () => {
  const blogsAtStart = await helper.blogsInDb();

  const newBlog = {
    title: 'new title',
    author: 'new author',
    url: 'new url',
    likes: 10,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  const titles = await blogsAtEnd.map((blog) => blog.title);

  expect(titles).toContain(newBlog.title);
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1);
});

test('if likes property is missing in a new blog, it defaults to 0', async () => {
  const newBlog = {
    title: 'new title',
    author: 'new author',
    url: 'new url',
  };

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  expect(response.body.likes).toBe(0);
});

test("a new blog without both title and url isn't created and the response is code 400", async () => {
  const blogsAtStart = await helper.blogsInDb();

  const newBlog = {
    author: 'new author',
    likes: 10,
  };

  await api.post('/api/blogs').send(newBlog).expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
});

afterAll(() => {
  mongoose.connection.close();
});
