import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BaseLayout from '../components/BaseLayout';

describe('BaseLayout', () => {
  test('renders topbar', () => {
    render(
      <BrowserRouter>
        <BaseLayout />
      </BrowserRouter>
    );
    const topbar = screen.getByTestId('topbar');
    expect(topbar).toBeDefined();
  });

  test('renders closed navbar', () => {
    render(
      <BrowserRouter>
        <BaseLayout />
      </BrowserRouter>
    );
    const navbar = screen.getByTestId('closed-navbar');
    expect(navbar).toBeDefined();
  });

  test('renders main content container', () => {
    render(
      <BrowserRouter>
        <BaseLayout />
      </BrowserRouter>
    );
    const mainContent = screen.getByTestId('main-content');
    expect(mainContent).toBeDefined();
  });
});
