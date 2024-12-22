import supertest from 'supertest';
import app from '../app';

const api = supertest(app);

describe('catchAll API get', () => {
  test('requests to "/" get status code 200', async () => {
    await api.get('/').expect(200);
  });

  test('requests to "/todo" get status code 200', async () => {
    await api.get('/todo').expect(200);
  });

  test('requests to "/todo" get status code 200', async () => {
    await api.get('/weathermap').expect(200);
  });
});
