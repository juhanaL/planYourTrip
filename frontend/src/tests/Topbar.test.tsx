import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Topbar from '../components/Topbar';

describe('Topbar', () => {
  test('renders image', () => {
    render(
      <BrowserRouter>
        <Topbar />
      </BrowserRouter>
    );
    const image = screen.getByAltText("Logo with text 'plan your trip' and icon of the earth.");
    expect(image).toBeDefined();
  });
});
