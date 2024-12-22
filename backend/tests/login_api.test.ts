import supertest from 'supertest';
import app from '../app';

const api = supertest(app);

describe('login API post', () => {
  test('fails with statuscode 401 if no uuid is sent', async () => {
    await api.post('/api/login').expect(401);
  });

  test('fails with statuscode 401 if non-string uuid is sent', async () => {
    await api.post('/api/login').send({ uuid: 123 }).expect(401);
  });

  test('succeeds when string format uuid is sent', async () => {
    const response = await api.post('/api/login').send({ uuid: '123' });
    expect(response.body.uuid).toBe('123');
  });
});
