import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  test('Renders top bar, nav bar and main content', () => {
    render(<App />);
    expect(screen.getByTestId('topbar')).toBeDefined();
    expect(screen.getByTestId('closed-navbar')).toBeDefined();
    expect(screen.getByTestId('main-content')).toBeDefined();
  });
});
