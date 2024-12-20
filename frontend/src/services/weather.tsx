import axios from 'axios';

type Coords = {
  lat: number;
  lng: number;
};

const baseUrl = '/api';

const getWeatherData = (newCoords: Coords) => {
  const request = axios.get(`${baseUrl}/weather`, {
    params: { lat: newCoords.lat, lng: newCoords.lng },
  });
  return request.then((response) => response.data);
};

const getName = (newCoords: Coords) => {
  //  const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${newCoords.lat}&lon=${newCoords.lng}&limit=1&appid=${import.meta.env.VITE_WEATHER_API_KEY}`;

  const request = axios.get(`${baseUrl}/name`, {
    params: { lat: newCoords.lat, lng: newCoords.lng },
  });
  return request.then((response) => response.data);
};

const getCamera = (newCoords: Coords) => {
  // const url = `https://api.windy.com/webcams/api/v3/webcams?lang=en&limit=10&offset=0&nearby=${newCoords.lat}%2C${newCoords.lng}%2C250&categories=meteo&include=images`;

  const request = axios.get(`${baseUrl}/webcam`, {
    params: { lat: newCoords.lat, lng: newCoords.lng },
  });
  return request.then((response) => response.data);
};

const getTime = (newCoords: Coords) => {
  // const url = `https://timeapi.io/api/time/current/coordinate?latitude=${newCoords.lat}&longitude=${newCoords.lng}`;

  const request = axios.get(`${baseUrl}/time`, {
    params: { lat: newCoords.lat, lng: newCoords.lng },
  });
  return request.then((response) => response.data);
};

export default {
  getWeatherData,
  getName,
  getCamera,
  getTime,
};
