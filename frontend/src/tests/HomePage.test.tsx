import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../components/HomePage';

describe('HomePage', () => {
  test('renders correct text and components', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    expect(screen.getByText('Plan your next', { exact: false }));

    expect(screen.getByText('Weather map'));
    expect(screen.getByAltText('Preview of Weather map functionality'));
    expect(screen.getByText('Need inspiration', { exact: false }));

    expect(screen.getByText('Trip To Do'));
    expect(screen.getByAltText('Preview of Trip To Do functionality'));
    expect(screen.getByText('Planning a trip can get', { exact: false }));
  });
});
