import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import TodoButton from '../components/TodoButton';

describe('TodoButon', () => {
  test('Renders button with text', () => {
    render(<TodoButton text="Button test" handleClick={() => {}} />);
    expect(screen.getByText('Button test')).toBeDefined();
  });

  test('Fires handleClick function on click', () => {
    const mockHandler = vi.fn();
    render(<TodoButton text="Button test" handleClick={mockHandler} />);

    const button = screen.getByText('Button test');

    fireEvent.click(button);

    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});
