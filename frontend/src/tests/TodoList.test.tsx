import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import todoService from '../services/todos';
import loginService from '../services/login';
import TodoList from '../components/TodoList';

const initialTestingTodos = [
  { text: 'test1', id: -3, placeNumber: 2, done: false },
  { text: 'test2', id: -2, placeNumber: 3, done: true },
  { text: 'test3', id: -1, placeNumber: 1, done: false },
];

describe('TodoList', () => {
  vi.spyOn(loginService, 'login').mockResolvedValue({
    token: 'something',
    uuid: '123',
  });

  vi.spyOn(todoService, 'getAllTodos').mockResolvedValue(initialTestingTodos);

  vi.spyOn(todoService, 'updatePlaceNumber').mockResolvedValue(null);

  test('Renders correct titles', async () => {
    render(<TodoList />);
    await waitFor(() => {
      expect(screen.getByText('To Do list')).toBeDefined();
      expect(screen.getByText('Completed tasks')).toBeDefined();
    });
  });

  test('Renders button with correct text', async () => {
    render(<TodoList />);
    await waitFor(() => {
      expect(screen.getByText('Add To do item')).toBeDefined();
    });
  });

  test('Renders correct to-dos to correct places in correct order', async () => {
    render(<TodoList />);
    await waitFor(() => {
      const activeTasksContainer = within(screen.getByTestId('active-todo-container'));
      const completedTasksContainer = within(screen.getByTestId('completed-todo-container'));

      const activeTasks = activeTasksContainer.getAllByTestId('todo-item-draggable-false');
      const completedTasks = completedTasksContainer.getAllByTestId('todo-item-draggable-false');

      expect(activeTasks).toHaveLength(2);
      expect(within(activeTasks[0]).getByText('test3')).toBeDefined();
      expect(within(activeTasks[1]).getByText('test1')).toBeDefined();

      expect(completedTasks).toHaveLength(1);
      expect(within(completedTasks[0]).getByText('test2')).toBeDefined();
    });
  });

  test('Renders correct values for checkboxes', async () => {
    render(<TodoList />);
    await waitFor(() => {
      const checkbox1 = screen.getByTestId('-1-checkbox') as HTMLInputElement;
      const checkbox2 = screen.getByTestId('-2-checkbox') as HTMLInputElement;
      const checkbox3 = screen.getByTestId('-3-checkbox') as HTMLInputElement;

      expect(checkbox1.checked).toBe(false);
      expect(checkbox2.checked).toBe(true);
      expect(checkbox3.checked).toBe(false);
    });
  });

  test('Adds new todo-item to the end of the active todo list when button pressed', async () => {
    vi.spyOn(todoService, 'createNewTodo').mockResolvedValue({
      text: '',
      id: 0,
      placeNumber: 4,
      done: false,
    });

    render(<TodoList />);

    const button = screen.getByText('Add To do item');
    fireEvent.click(button);

    await waitFor(() => {
      const activeTasksContainer = within(screen.getByTestId('active-todo-container'));
      const activeTasks = activeTasksContainer.getAllByTestId('todo-item-draggable-false');
      const lastTask = within(activeTasks[activeTasks.length - 1]);
      const lastTextArea = lastTask.getByTestId('0-textarea') as HTMLTextAreaElement;
      const lastCheckbox = lastTask.getByTestId('0-checkbox') as HTMLInputElement;

      expect(lastTextArea.value).toBe('');
      expect(lastCheckbox.checked).toBe(false);
    });
  });

  test('Changes if the item is rendered in the active todo list or completed todo list, when checkbox is clicked', async () => {
    vi.spyOn(todoService, 'updateDoneStatus').mockResolvedValue(null);

    render(<TodoList />);

    await waitFor(() => {
      const activeTasksContainer = within(screen.getByTestId('active-todo-container'));
      const completedTasksContainer = within(screen.getByTestId('completed-todo-container'));

      expect(activeTasksContainer.getByText('test1')).toBeDefined();
      expect(completedTasksContainer.queryByText('test1')).toBeNull();

      const checkbox = screen.getByTestId('-3-checkbox');
      fireEvent.click(checkbox);

      expect(activeTasksContainer.queryByText('test1')).toBeNull();
      expect(completedTasksContainer.getByText('test1')).toBeDefined();

      const checkbox2 = screen.getByTestId('-3-checkbox');
      fireEvent.click(checkbox2);

      expect(activeTasksContainer.getByText('test1')).toBeDefined();
      expect(completedTasksContainer.queryByText('test1')).toBeNull();
    });
  });

  test('Removes todo-item from list when delete icon is clicked', async () => {
    vi.spyOn(todoService, 'deleteTodo').mockResolvedValue(null);

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText('test1')).toBeDefined();
      const removeIcon = screen.getByTestId('-3-removeButton');
      fireEvent.click(removeIcon);
      expect(screen.queryByText('test1')).toBeNull();
    });
  });

  test('Removes todo-item from list when delete icon is selected and enter pressed', async () => {
    vi.spyOn(todoService, 'deleteTodo').mockResolvedValue(null);

    render(<TodoList />);

    await waitFor(() => {
      expect(screen.getByText('test1')).toBeDefined();
      const removeIcon = screen.getByTestId('-3-removeButton');
      fireEvent.keyDown(removeIcon, { key: 'Enter', code: 'Enter', charCode: 13 });
      expect(screen.queryByText('test1')).toBeNull();
    });
  });

  test('changes todo item text when typed into', async () => {
    vi.spyOn(todoService, 'updateText').mockResolvedValue(null);

    render(<TodoList />);

    await waitFor(async () => {
      expect(screen.getByText('test1')).toBeDefined();

      const textArea = screen.getByTestId('-3-textarea');
      await userEvent.type(textArea, ' extended text');

      expect(screen.getByText('test1 extended text')).toBeDefined();
      expect(screen.queryByText('test1')).toBeNull();
    });
  });

  test('changes places of items when an item is dragged enough', async () => {
    render(<TodoList />);

    await waitFor(async () => {
      const activeTasksContainer = within(screen.getByTestId('active-todo-container'));
      const activeTasks = activeTasksContainer.getAllByTestId('todo-item-draggable-false');
      expect(within(activeTasks[0]).getByText('test3')).toBeDefined();
      expect(within(activeTasks[1]).getByText('test1')).toBeDefined();

      const dragIcon = screen.getByTestId('-3-sortIcon');
      fireEvent.mouseDown(dragIcon);
      fireEvent.mouseMove(dragIcon, { clientX: 0, clientY: 1000 });
      fireEvent.mouseUp(dragIcon);

      expect(within(activeTasks[1]).getByText('test1')).toBeDefined();
      expect(within(activeTasks[0]).getByText('test3')).toBeDefined();
    });
  });
});
