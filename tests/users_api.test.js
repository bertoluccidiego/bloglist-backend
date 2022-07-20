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

  test('an invalid user is not created and is reported', async () => {
    const usersAtStart = await helper.usersInDb();

    // A user without username is invalid
    const newUser = {
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
