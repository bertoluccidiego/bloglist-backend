const supertest = require('supertest');

const app = require('../app');

const api = supertest(app);

describe('App', () => {
  test('An unknown endpoint responds with 404 and an appropiate message', async () => {
    const result = await api.get('/api/doesntexits').expect(404);
    expect(result.body.error).toBe('unknown endpoint');
  });
});
