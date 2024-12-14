import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { vi } from 'vitest';
import WeatherMap from '../components/WeatherMap';

describe('WeatherMap', () => {
  test('renders selection map', () => {
    render(<WeatherMap />);
    const map = screen.getByText('Leaflet');
    expect(map).toBeDefined();
  });

  test('renders webcam picture and data if api call successful', async () => {
    vi.spyOn(axios, 'get')
      .mockResolvedValueOnce({
        data: { weather: [{ icon: 'test' }], main: { temp: 20 } },
      })
      .mockResolvedValueOnce({
        data: {
          time: '16:00',
        },
      })
      .mockResolvedValueOnce({
        data: {
          webcams: [
            {
              images: {
                current: {
                  preview: 'test',
                },
              },
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: [{ name: 'Helsinki' }],
      });

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
  });

  test('Does not render weather data or webcam picture if api calls reuturn false format data', async () => {
    vi.spyOn(axios, 'get').mockResolvedValue({
      data: 'wrong',
    });

    render(<WeatherMap />);

    await waitFor(() => {
      expect(screen.queryByText('Weather in', { exact: false })).toBeNull();
      expect(screen.queryByText('Temperature', { exact: false })).toBeNull();
      expect(screen.queryByText('Local time', { exact: false })).toBeNull();
      expect(screen.queryByAltText('Weather icon')).toBeNull();
      expect(screen.queryByAltText('Webcam from defined location')).toBeNull();
    });
  });

  test('Does not render weather data or webcam picture if api calls reuturn null', async () => {
    vi.spyOn(axios, 'get').mockResolvedValue({
      data: null,
    });

    render(<WeatherMap />);

    await waitFor(() => {
      expect(screen.queryByText('Weather in', { exact: false })).toBeNull();
      expect(screen.queryByText('Temperature', { exact: false })).toBeNull();
      expect(screen.queryByText('Local time', { exact: false })).toBeNull();
      expect(screen.queryByAltText('Weather icon')).toBeNull();
      expect(screen.queryByAltText('Webcam from defined location')).toBeNull();
    });
  });

  test('Does not render weather data or webcam picture if api calls fail', async () => {
    vi.spyOn(axios, 'get').mockRejectedValue('Error');

    render(<WeatherMap />);

    await waitFor(() => {
      expect(screen.queryByText('Weather in', { exact: false })).toBeNull();
      expect(screen.queryByText('Temperature', { exact: false })).toBeNull();
      expect(screen.queryByText('Local time', { exact: false })).toBeNull();
      expect(screen.queryByAltText('Weather icon')).toBeNull();
      expect(screen.queryByAltText('Webcam from defined location')).toBeNull();
    });
  });
});
