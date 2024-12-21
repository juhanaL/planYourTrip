import axios from 'axios';

type Coords = {
  lat: number;
  lng: number;
};

const baseUrl = '/api/weather';

const getWeatherData = (newCoords: Coords) => {
  const request = axios.get(`${baseUrl}/weather`, {
    params: { lat: newCoords.lat, lng: newCoords.lng },
  });
  return request.then((response) => response.data);
};

const getName = (newCoords: Coords) => {
  const request = axios.get(`${baseUrl}/name`, {
    params: { lat: newCoords.lat, lng: newCoords.lng },
  });
  return request.then((response) => response.data);
};

const getCamera = (newCoords: Coords) => {
  const request = axios.get(`${baseUrl}/webcam`, {
    params: { lat: newCoords.lat, lng: newCoords.lng },
  });
  return request.then((response) => response.data);
};

const getTime = (newCoords: Coords) => {
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
