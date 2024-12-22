import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import weatherService from '../services/weather';
import WeatherMap from '../components/WeatherMap';

describe('WeatherMap', () => {
  test('renders selection map', async () => {
    vi.spyOn(weatherService, 'getWeatherData').mockResolvedValue({
      weather: [{ icon: 'test' }],
      main: { temp: 20 },
    });

    vi.spyOn(weatherService, 'getTime').mockResolvedValue({
      time: '16:00',
    });

    vi.spyOn(weatherService, 'getCamera').mockResolvedValue({
      webcams: [{ images: { current: { preview: 'test' } } }],
    });

    vi.spyOn(weatherService, 'getName').mockResolvedValue([{ name: 'Helsinki' }]);

    render(<WeatherMap />);

    await waitFor(() => {
      const map = screen.getByText('Leaflet');
      expect(map).toBeDefined();
    });

    vi.clearAllMocks();
  });

  test('renders webcam picture and data if api call successful', async () => {
    vi.spyOn(weatherService, 'getWeatherData').mockResolvedValue({
      weather: [{ icon: 'test' }],
      main: { temp: 20 },
    });

    vi.spyOn(weatherService, 'getTime').mockResolvedValue({
      time: '16:00',
    });

    vi.spyOn(weatherService, 'getCamera').mockResolvedValue({
      webcams: [{ images: { current: { preview: 'test' } } }],
    });

    vi.spyOn(weatherService, 'getName').mockResolvedValue([{ name: 'Helsinki' }]);

    render(<WeatherMap />);

    const camAndDataContainer = screen.getByTestId('weather-data-and-cam-container');
    expect(camAndDataContainer).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText('Weather in Helsinki')).toBeDefined();
      expect(screen.getByText('Temperature: 20 C')).toBeDefined();
      expect(screen.getByText('Local time: 16:00')).toBeDefined();
      expect(screen.getByAltText('Weather icon')).toBeDefined();
      expect(screen.getByAltText('Webcam from defined location')).toBeDefined();
    });

    vi.clearAllMocks();
  });

  test('Does not render weather data or webcam picture if api calls reuturn false format data', async () => {
    vi.spyOn(weatherService, 'getWeatherData').mockResolvedValue({ wrong: 'wrong' });
    vi.spyOn(weatherService, 'getCamera').mockResolvedValue({ wrong: 'wrong' });
    vi.spyOn(weatherService, 'getName').mockResolvedValue({ wrong: 'wrong' });
    vi.spyOn(weatherService, 'getTime').mockResolvedValue({ wrong: 'wrong' });

    render(<WeatherMap />);

    await waitFor(() => {
      expect(screen.queryByText('Weather in', { exact: false })).toBeNull();
      expect(screen.queryByText('Temperature', { exact: false })).toBeNull();
      expect(screen.queryByText('Local time', { exact: false })).toBeNull();
      expect(screen.queryByAltText('Weather icon')).toBeNull();
      expect(screen.queryByAltText('Webcam from defined location')).toBeNull();
    });
    vi.clearAllMocks();
  });

  test('Does not render weather data or webcam picture if api calls return null', async () => {
    vi.spyOn(weatherService, 'getWeatherData').mockResolvedValue(null);
    vi.spyOn(weatherService, 'getCamera').mockResolvedValue(null);
    vi.spyOn(weatherService, 'getName').mockResolvedValue(null);
    vi.spyOn(weatherService, 'getTime').mockResolvedValue(null);

    render(<WeatherMap />);

    await waitFor(() => {
      expect(screen.queryByText('Weather in', { exact: false })).toBeNull();
      expect(screen.queryByText('Temperature', { exact: false })).toBeNull();
      expect(screen.queryByText('Local time', { exact: false })).toBeNull();
      expect(screen.queryByAltText('Weather icon')).toBeNull();
      expect(screen.queryByAltText('Webcam from defined location')).toBeNull();
    });

    vi.clearAllMocks();
  });

  test('Does not render weather data or webcam picture if api calls fail', async () => {
    vi.spyOn(weatherService, 'getWeatherData').mockRejectedValue('Error');
    vi.spyOn(weatherService, 'getCamera').mockRejectedValue('Error');
    vi.spyOn(weatherService, 'getName').mockRejectedValue('Error');
    vi.spyOn(weatherService, 'getTime').mockRejectedValue('Error');

    render(<WeatherMap />);

    await waitFor(() => {
      expect(screen.queryByText('Weather in', { exact: false })).toBeNull();
      expect(screen.queryByText('Temperature', { exact: false })).toBeNull();
      expect(screen.queryByText('Local time', { exact: false })).toBeNull();
      expect(screen.queryByAltText('Weather icon')).toBeNull();
      expect(screen.queryByAltText('Webcam from defined location')).toBeNull();
    });

    vi.clearAllMocks();
  });
});
