import { useState, useEffect, useRef } from 'react';
import TodoButton from './TodoButton';
import TodoItem from './TodoItem';

import '../styles/TodoList.css';

interface TodosType {
  text: string;
  id: number;
  placeNumber: number;
  done: boolean;
}

const initialTestingTodos = [
  { text: 'test1', id: -3, placeNumber: 2, done: false },
  { text: 'test2', id: -2, placeNumber: 3, done: true },
  { text: 'test3', id: -1, placeNumber: 1, done: false },
];

const TodoList = () => {
  const [todos, setTodos] = useState<TodosType[]>([]);
  const [nextId, setNextId] = useState<number>(0);

  const avgYCoordsRef = useRef(new Map<number, number>());
  const placeNumbersRef = useRef<number[]>([]);

  const generateId = () => {
    const currentId = nextId;
    setNextId(currentId + 1);
    return currentId;
  };

  const recalculatePlaceNumber = (todoList: TodosType[]) => {
    const todosWithNewPlaceNumbers = todoList.map((todo, index) => {
      return { ...todo, placeNumber: index };
    });
    return todosWithNewPlaceNumbers;
  };

  const sortTodoItems = (unsortedTodos: TodosType[]) => {
    const sortedTodos = unsortedTodos.sort((a, b) => a.placeNumber - b.placeNumber);
    const sortedTodosWithPlacenumberCheck = recalculatePlaceNumber(sortedTodos);
    setTodos(sortedTodosWithPlacenumberCheck);
  };

  const addTodoItem = () => {
    const newPlaceNumber = todos.length;
    setTodos(
      todos.concat({
        text: '',
        id: generateId(),
        placeNumber: newPlaceNumber,
        done: false,
      })
    );
  };

  const removeTodoItem = (id: number) => {
    avgYCoordsRef.current.delete(id);
    const newTodos = todos.filter((todo) => todo.id !== id);
    const newTodosWithPlaceNumbers = recalculatePlaceNumber(newTodos);
    setTodos(newTodosWithPlaceNumbers);
  };

  const changeTodoText = (id: number, newTodoText: string) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, text: newTodoText };
      }
      return todo;
    });

    setTodos(newTodos);
  };

  const toggleDone = (id: number, checked: boolean) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, done: checked };
      }
      return todo;
    });

    setTodos(newTodos);
  };

  const reallocatePlaceNumbers = (id: number) => {
    const oldTodos = todos;
    const todoType = oldTodos.find((todo) => todo.id === id)?.done;
    const todosOfDoneType = oldTodos.filter((todo) => todo.done === todoType);
    const placeNumbers = todosOfDoneType.map((todo) => todo.placeNumber);

    const yCoords = todosOfDoneType.map((todo) => {
      return {
        id: todo.id,
        yCoord: avgYCoordsRef.current.get(todo.id) || 0,
      };
    });

    const sortedYCoords = yCoords.sort((a, b) => a.yCoord - b.yCoord);

    placeNumbersRef.current = sortedYCoords.map((todo) => todo.id);

    const sortedYCoordsWithPlaceNumber = sortedYCoords.map((todo, index) => {
      return { ...todo, placeNumber: placeNumbers[index] };
    });

    const newTodos = oldTodos.map((todo) => {
      const possiblePlaceNumber = sortedYCoordsWithPlaceNumber.find(
        (sortedTodo) => sortedTodo.id === todo.id
      )?.placeNumber;
      const newPlaceNumber = possiblePlaceNumber == null ? todo.placeNumber : possiblePlaceNumber;
      return {
        ...todo,
        placeNumber: newPlaceNumber,
      };
    });

    sortTodoItems(newTodos);
  };

  const setTodoItemCoordinates = (id: number, avgYCoords: number) => {
    avgYCoordsRef.current.set(id, avgYCoords);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => sortTodoItems(initialTestingTodos), []);

  const returnTodoElement = (todo: TodosType) => {
    return (
      <TodoItem
        todoText={todo.text}
        id={todo.id}
        done={todo.done}
        removeTodoItem={removeTodoItem}
        changeTodoText={changeTodoText}
        toggleDone={toggleDone}
        setCoordinates={setTodoItemCoordinates}
        reallocatePlaceNumbers={reallocatePlaceNumbers}
        placeNumber={todo.placeNumber}
        key={todo.id}
      />
    );
  };

  return (
    <div className="todo-container">
      <div className="active-todo-container">
        <h2 className="todo-heading">To Do list</h2>
        <TodoButton text="Add To do item" handleClick={addTodoItem} />
        {todos.filter((todo) => !todo.done).map((todo) => returnTodoElement(todo))}
      </div>
      <div className="completed-todo-container">
        <h2 className="todo-heading">Completed tasks</h2>
        {todos.filter((todo) => todo.done).map((todo) => returnTodoElement(todo))}
      </div>
    </div>
  );
};

export default TodoList;
