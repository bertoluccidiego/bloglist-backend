const supertest = require('supertest');
const mongoose = require('mongoose');

const User = require('../models/user');
const helper = require('./users_test_helper');
const app = require('../app');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  await User.insertMany(helper.initialUsers);
});

describe('POST', () => {
  test('a valid user is created', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'diego',
      name: 'Diego C. Bertolucci',
      password: 'diego',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    const usernames = usersAtEnd.map((user) => user.username);

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
    expect(usernames).toContain(newUser.username);
  });

  test('a user without username is not created and is reported', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: 'Diego C. Bertolucci',
      password: 'diego',
    };

    await api.post('/api/users').send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();

    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('a user without password is not created and is reported', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'diego',
      name: 'Diego C. Bertolucci',
    };

    await api.post('/api/users').send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();

    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('a user with a password shorter than 3 characters is not created and is reported', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'diego',
      name: 'Diego C. Bertolucci',
      password: 'di',
    };

    await api.post('/api/users').send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();

    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('a user with a username shorter than 3 characters is not created and is reported', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'di',
      name: 'Diego C. Bertolucci',
      password: 'diego',
    };

    await api.post('/api/users').send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();

    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('an existant user cannot be created', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'user1',
      name: 'Diego C Bertolucci',
      password: 'diego',
    };

    await api.post('/api/users').send(newUser).expect(409);

    const usersAtEnd = await helper.usersInDb();

    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
