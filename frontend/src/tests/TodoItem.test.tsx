import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import TodoItem from '../components/TodoItem';

describe('TodoItem', () => {
  test('Renders correct text and elements', () => {
    render(
      <TodoItem
        todoText="Test1"
        id="0"
        done={false}
        removeTodoItem={() => {}}
        changeTodoText={() => {}}
        toggleDone={() => {}}
        setCoordinates={() => {}}
        reallocatePlaceNumbers={() => {}}
        placeNumber={1}
        key={0}
      />
    );
    expect(screen.getByText('Test1')).toBeDefined();
    expect(screen.getByTestId('0-sortIcon')).toBeDefined();
    expect(screen.getByTestId('0-checkbox')).toBeDefined();
    expect(screen.getByTestId('0-textarea')).toBeDefined();
  });

  test('trigger autoscrolling on mouse movement', () => {
    const scrollByMock = vi.fn();
    Element.prototype.scrollBy = scrollByMock;

    render(
      <div
        className="main-content"
        data-testid="main-content"
        id="main-content"
        style={{ overflow: 'scroll' }}
      >
        <TodoItem
          todoText="Test1"
          id="0"
          done={false}
          removeTodoItem={() => {}}
          changeTodoText={() => {}}
          toggleDone={() => {}}
          setCoordinates={() => {}}
          reallocatePlaceNumbers={() => {}}
          placeNumber={1}
          key={0}
        />
      </div>
    );

    vi.spyOn(document, 'getElementById').mockReturnValue(screen.getByTestId('main-content'));

    const dragIcon = screen.getByTestId('0-sortIcon');
    fireEvent.mouseDown(dragIcon);
    fireEvent.mouseMove(dragIcon, { clientX: 0, clientY: 1000 });
    fireEvent.mouseUp(dragIcon);

    fireEvent.mouseDown(dragIcon);
    fireEvent.mouseMove(dragIcon, { clientX: 0, clientY: -1000 });
    fireEvent.mouseUp(dragIcon);
    expect(scrollByMock).toHaveBeenCalledTimes(2);
  });
});
