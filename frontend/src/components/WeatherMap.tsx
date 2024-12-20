import { useState, useEffect } from 'react';
import weatherService from '../services/weather';
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
    weatherService
      .getTime(newCoords)
      .then((data) => {
        if (data && typeof data.time === 'string') {
          setTime(data.time);
        } else {
          setTime(null);
        }
      })
      .catch(() => {
        setTime(null);
      });
  };

  const getCamera = (newCoords: Coords) => {
    weatherService
      .getCamera(newCoords)
      .then((data) => {
        if (data && typeof data.webcams[0].images.current.preview === 'string') {
          setCam(data.webcams[0].images.current.preview);
        } else {
          setCam(null);
        }
      })
      .catch(() => {
        setCam(null);
      });
  };

  const getName = (newCoords: Coords) => {
    weatherService
      .getName(newCoords)
      .then((data) => {
        if (data && typeof data[0].name === 'string') {
          setName(data[0].name);
        } else {
          setName(`Lat: ${newCoords.lat.toFixed(4)}, Long: ${newCoords.lng.toFixed(4)}`);
        }
      })
      .catch(() => {
        setName(`Lat: ${newCoords.lat.toFixed(4)}, Long: ${newCoords.lng.toFixed(4)}`);
      });
  };

  const changeWeather = (newCoords: Coords) => {
    weatherService
      .getWeatherData(newCoords)
      .then((data) => {
        if (
          data &&
          typeof data.weather[0].icon === 'string' &&
          typeof data.main.temp === 'number'
        ) {
          setWeather(data);
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
