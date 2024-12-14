import { useState, useEffect } from 'react';
import axios from 'axios';
import SelectionMap from './SelectionMap';
import WeatherData from './WeatherData';
import WebcamPicture from './WebcamPicture';

import '../styles/WeatherMap.css';

type Coords = {
  lat: number;
  lng: number;
};

type Weather = {
  main: { temp: number };
  weather: [{ icon: string }];
};

const initCoords = {
  lat: 60.1756,
  lng: 24.9342,
};

const WeatherMap = () => {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [cam, setCam] = useState<string | null>(null);
  const [coords, setCoords] = useState<Coords | null>(initCoords);
  const [name, setName] = useState<string | null>(null);

  const changeTime = (newCoords: Coords) => {
    const url = `https://timeapi.io/api/time/current/coordinate?latitude=${newCoords.lat}&longitude=${newCoords.lng}`;

    axios
      .get(url)
      .then((data) => {
        if (data.data && typeof data.data.time === 'string') {
          setTime(data.data.time);
        } else {
          setTime(null);
        }
      })
      .catch(() => {
        setTime(null);
      });
  };

  const getCamera = (newCoords: Coords) => {
    const url = `https://api.windy.com/webcams/api/v3/webcams?lang=en&limit=10&offset=0&nearby=${newCoords.lat}%2C${newCoords.lng}%2C250&categories=meteo&include=images`;

    axios
      .get(url, {
        headers: { 'x-windy-api-key': `${import.meta.env.VITE_X_WINDY_API_KEY}` },
      })
      .then((data) => {
        if (data.data && typeof data.data.webcams[0].images.current.preview === 'string') {
          setCam(data.data.webcams[0].images.current.preview);
        } else {
          setCam(null);
        }
      })
      .catch(() => {
        setCam(null);
      });
  };

  const getName = (newCoords: Coords) => {
    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${newCoords.lat}&lon=${newCoords.lng}&limit=1&appid=${import.meta.env.VITE_WEATHER_API_KEY}`;

    axios
      .get(url)
      .then((data) => {
        if (data.data && typeof data.data[0].name === 'string') {
          setName(data.data[0].name);
        } else {
          setName(`Lat: ${newCoords.lat.toFixed(4)}, Long: ${newCoords.lng.toFixed(4)}`);
        }
      })
      .catch(() => {
        setName(`Lat: ${newCoords.lat.toFixed(4)}, Long: ${newCoords.lng.toFixed(4)}`);
      });
  };

  const changeWeather = (newCoords: Coords) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${newCoords.lat}&lon=${newCoords.lng}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`;

    axios
      .get(url)
      .then((data) => {
        if (
          data.data &&
          typeof data.data.weather[0].icon === 'string' &&
          typeof data.data.main.temp === 'number'
        ) {
          setWeather(data.data);
        } else {
          setWeather(null);
        }
      })
      .catch(() => {
        setWeather(null);
      });

    changeTime(newCoords);
    getCamera(newCoords);
    getName(newCoords);
  };

  useEffect(() => {
    changeWeather(initCoords);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="weather-window">
      <SelectionMap
        setCoords={setCoords}
        coords={coords}
        changeWeather={changeWeather}
        initCoords={initCoords}
      />

      <div className="weather-data-and-cam-container" data-testid="weather-data-and-cam-container">
        <WebcamPicture url={cam} />
        <WeatherData weather={weather} time={time} name={name} />
      </div>
    </div>
  );
};

export default WeatherMap;
