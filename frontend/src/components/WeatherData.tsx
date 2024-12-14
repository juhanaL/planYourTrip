import '../styles/WeatherData.css';

type Weather = {
  main: { temp: number };
  weather: { icon: string }[];
};

interface Props {
  weather: Weather | null;
  name: string | null;
  time: string | null;
}

const WeatherData = ({ weather, name, time }: Props) => {
  if (!weather) {
    return null;
  }
  return (
    <>
      {name && <h2>Weather in {name}</h2>}
      <div className="weather-data-and-icon-container">
        <div className="weather-data-container">
          <p>Temperature: {weather.main.temp} C</p>
          {time && <p>Local time: {time}</p>}
        </div>
        <img
          className="weather-icon"
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt="Weather icon"
        />
      </div>
    </>
  );
};

export default WeatherData;
