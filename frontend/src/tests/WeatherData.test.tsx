import { render, screen } from '@testing-library/react';
import WeatherData from '../components/WeatherData';

describe('WeatherData', () => {
  const weather = {
    main: { temp: 10 },
    weather: Array({ icon: 'asdas' }),
  };

  const name = 'Helsinki';

  const time = '16:00';

  test('renders correct heading', () => {
    render(<WeatherData weather={weather} name={name} time={time} />);
    const heading = screen.getByText('Weather in Helsinki');
    expect(heading).toBeDefined();
  });

  test('renders correct temperature', () => {
    render(<WeatherData weather={weather} name={name} time={time} />);
    const temperature = screen.getByText('Temperature: 10 C');
    expect(temperature).toBeDefined();
  });

  test('renders correct time', () => {
    render(<WeatherData weather={weather} name={name} time={time} />);
    const localTime = screen.getByText('Local time: 16:00');
    expect(localTime).toBeDefined();
  });

  test('renders image or alt text', () => {
    render(<WeatherData weather={weather} name={name} time={time} />);
    const image = screen.getByAltText('Weather icon');
    expect(image).toBeDefined();
  });

  test('renders nothing if the "weather" prop is not defined', () => {
    const { container } = render(<WeatherData weather={null} name={name} time={time} />);

    expect(container.childElementCount).toEqual(0);
  });
});
