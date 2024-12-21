import { Router, Request, Response } from 'express';
import axios from 'axios';
import config from '../utils/config';

const router = Router();

router.get('/weather', (request: Request, response: Response) => {
  const { lat } = request.query;
  const { lng } = request.query;

  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
    response.status(400).json({
      error: 'coordinates must be included and numbers',
    });
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${config.WEATHER_API_KEY}&units=metric`;

  const axiosRequest = axios.get(url);
  axiosRequest
    .then((axiosResponse) => response.json(axiosResponse.data))
    .catch((axiosError) =>
      response.status(axiosError.response.status).json({ error: `Fetching weather data failed.` })
    );
});

router.get('/name', (request: Request, response: Response) => {
  const { lat } = request.query;
  const { lng } = request.query;

  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
    response.status(400).json({
      error: 'coordinates must be included and numbers',
    });
    return;
  }

  const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${config.WEATHER_API_KEY}`;

  const axiosRequest = axios.get(url);
  axiosRequest
    .then((axiosResponse) => response.json(axiosResponse.data))
    .catch((axiosError) =>
      response.status(axiosError.response.status).json({ error: `Fetching name data failed.` })
    );
});

router.get('/time', (request: Request, response: Response) => {
  const { lat } = request.query;
  const { lng } = request.query;

  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
    response.status(400).json({
      error: 'coordinates must be included and numbers',
    });
    return;
  }

  const url = `https://timeapi.io/api/time/current/coordinate?latitude=${lat}&longitude=${lng}`;

  const axiosRequest = axios.get(url);
  axiosRequest
    .then((axiosResponse) => response.json(axiosResponse.data))
    .catch((axiosError) =>
      response.status(axiosError.response.status).json({ error: `Fetching time data failed.` })
    );
});

router.get('/webcam', (request: Request, response: Response) => {
  const { lat } = request.query;
  const { lng } = request.query;

  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
    response.status(400).json({
      error: 'coordinates must be included and numbers',
    });
    return;
  }

  const url = `https://api.windy.com/webcams/api/v3/webcams?lang=en&limit=10&offset=0&nearby=${lat}%2C${lng}%2C250&categories=meteo&include=images`;

  const axiosRequest = axios.get(url, {
    headers: { 'x-windy-api-key': `${config.X_WINDY_API_KEY}` },
  });
  axiosRequest
    .then((axiosResponse) => response.json(axiosResponse.data))
    .catch((axiosError) =>
      response.status(axiosError.response.status).json({ error: `Fetching webcam picture failed.` })
    );
});

export default router;
