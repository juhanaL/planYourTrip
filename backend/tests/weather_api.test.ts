import supertest from 'supertest';
import app from '../app';

const api = supertest(app);

describe('weather API get weather', () => {
  test('fails with statuscode 400 if coordinates not given as parameters', async () => {
    await api.get('/api/weather/weather').expect(400);
  });

  test('fails with statuscode 400 if coordinates given as parameters in non numeric format', async () => {
    await api.get('/api/weather/weather?lat=kuuskyt&lng=kaksnelja').expect(400);
  });

  test('fails with statuscode 400 if openweathermap api returns error', async () => {
    await api
      .get('/api/weather/weather?lat=6000000000000000000000&lng=2444444444444444444444444444444444')
      .expect(400);
  });

  test('succeeds if legit coordinates given as parameters', async () => {
    const response = await api.get('/api/weather/weather?lat=60.1797&lng=24.9344');
    expect(response.body.name).toStrictEqual('Helsinki');
  });

  test('succeeds if legit coordinates given as parameters even if other parameters are given also', async () => {
    const response = await api.get('/api/weather/weather?lat=60.1797&lng=24.9344&random=random');
    expect(response.body.name).toStrictEqual('Helsinki');
  });
});

describe('weather API get name', () => {
  test('fails with statuscode 400 if coordinates not given as parameters', async () => {
    await api.get('/api/weather/name').expect(400);
  });

  test('fails with statuscode 400 if coordinates given as parameters in non numeric format', async () => {
    await api.get('/api/weather/name?lat=kuuskyt&lng=kaksnelja').expect(400);
  });

  test('fails with statuscode 400 if openweathermap api returns error', async () => {
    await api
      .get('/api/weather/name?lat=6000000000000000000000&lng=2444444444444444444444444444444444')
      .expect(400);
  });

  test('succeeds if legit coordinates given as parameters', async () => {
    const response = await api.get('/api/weather/name?lat=60.1797&lng=24.9344');
    expect(response.body[0].name).toStrictEqual('Helsinki');
  });

  test('succeeds if legit coordinates given as parameters even if other parameters are given also', async () => {
    const response = await api.get('/api/weather/name?lat=60.1797&lng=24.9344&random=random');
    expect(response.body[0].name).toStrictEqual('Helsinki');
  });
});

describe('weather API get time', () => {
  test('fails with statuscode 400 if coordinates not given as parameters', async () => {
    await api.get('/api/weather/time').expect(400);
  });

  test('fails with statuscode 400 if coordinates given as parameters in non numeric format', async () => {
    await api.get('/api/weather/time?lat=kuuskyt&lng=kaksnelja').expect(400);
  });

  test('fails with statuscode 400 if openweathermap api returns error', async () => {
    await api
      .get('/api/weather/time?lat=6000000000000000000000&lng=2444444444444444444444444444444444')
      .expect(400);
  });

  test('succeeds if legit coordinates given as parameters', async () => {
    const response = await api.get('/api/weather/time?lat=60.1797&lng=24.9344');
    expect(response.body.timeZone).toStrictEqual('Europe/Helsinki');
  });

  test('succeeds if legit coordinates given as parameters even if other parameters are given also', async () => {
    const response = await api.get('/api/weather/time?lat=60.1797&lng=24.9344&random=random');
    expect(response.body.timeZone).toStrictEqual('Europe/Helsinki');
  });
});

describe('weather API get webcam', () => {
  test('fails with statuscode 400 if coordinates not given as parameters', async () => {
    await api.get('/api/weather/webcam').expect(400);
  });

  test('fails with statuscode 400 if coordinates given as parameters in non numeric format', async () => {
    await api.get('/api/weather/webcam?lat=kuuskyt&lng=kaksnelja').expect(400);
  });

  test('fails with statuscode 400 if openweathermap api returns error', async () => {
    await api
      .get('/api/weather/webcam?lat=6000000000000000000000&lng=2444444444444444444444444444444444')
      .expect(400);
  });

  test('succeeds if legit coordinates given as parameters', async () => {
    const response = await api.get('/api/weather/webcam?lat=60.1797&lng=24.9344');
    expect(Array.isArray(response.body.webcams)).toBeTruthy();
  });

  test('succeeds if legit coordinates given as parameters even if other parameters are given also', async () => {
    const response = await api.get('/api/weather/webcam?lat=60.1797&lng=24.9344&random=random');
    expect(Array.isArray(response.body.webcams)).toBeTruthy();
  });
});
