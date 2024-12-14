import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import SelectionMap from '../components/SelectionMap';

describe('SelectionMap', () => {
  const coords = {
    lat: 1,
    lng: 1,
  };

  test('renders leaflet map and marker', () => {
    render(
      <SelectionMap
        initCoords={coords}
        setCoords={() => {}}
        changeWeather={() => {}}
        coords={coords}
      />
    );
    const map = screen.getByText('Leaflet');
    expect(map).toBeDefined();

    const marker = screen.getByAltText('Marker');
    expect(marker).toBeDefined();
  });

  test('renders leaflet map but no marker if coordinates given as prop are null', () => {
    render(
      <SelectionMap
        initCoords={coords}
        setCoords={() => {}}
        changeWeather={() => {}}
        coords={null}
      />
    );
    const map = screen.getByText('Leaflet');
    expect(map).toBeDefined();

    const marker = screen.queryByAltText('Marker');
    expect(marker).toBeNull();
  });

  test('changeWeather and setCoords are called if map is clicked', async () => {
    const mockChangeWeather = vi.fn();
    const mockSetCoords = vi.fn();

    render(
      <SelectionMap
        initCoords={coords}
        setCoords={mockSetCoords}
        changeWeather={mockChangeWeather}
        coords={coords}
      />
    );

    const user = userEvent.setup();
    const marker = screen.getByAltText('Marker');
    await user.click(marker);

    expect(mockChangeWeather.mock.calls).toHaveLength(1);
    expect(mockSetCoords.mock.calls).toHaveLength(1);
  });
});
