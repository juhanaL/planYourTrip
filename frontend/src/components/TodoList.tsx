import { useState, useEffect, useRef } from 'react';
import TodoButton from './TodoButton';
import TodoItem from './TodoItem';
import todoService from '../services/todos';

import '../styles/TodoList.css';

interface TodosType {
  text: string;
  id: string;
  placeNumber: number;
  done: boolean;
}

const TodoList = () => {
  const [todos, setTodos] = useState<TodosType[]>([]);

  const avgYCoordsRef = useRef(new Map<string, number>());

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
    const newTodo = {
      text: '',
      placeNumber: todos.length,
      done: false,
    };

    todoService.createNewTodo(newTodo).then((returnedTodo) => {
      setTodos((prevTodos) => prevTodos.concat(returnedTodo));
    });
  };

  const removeTodoItem = (id: string) => {
    todoService.deleteTodo(id);
    avgYCoordsRef.current.delete(id);
    const newTodos = todos.filter((todo) => todo.id !== id);
    const newTodosWithPlaceNumbers = recalculatePlaceNumber(newTodos);
    setTodos(newTodosWithPlaceNumbers);
  };

  const changeTodoText = (id: string, newTodoText: string) => {
    todoService.updateText(id, newTodoText);
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, text: newTodoText };
      }
      return todo;
    });
    setTodos(newTodos);
  };

  const toggleDone = (id: string, checked: boolean) => {
    todoService.updateDoneStatus(id, checked);
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, done: checked };
      }
      return todo;
    });

    setTodos(newTodos);
  };

  const reallocatePlaceNumbers = (id: string) => {
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

  const setTodoItemCoordinates = (id: string, avgYCoords: number) => {
    avgYCoordsRef.current.set(id, avgYCoords);
  };

  useEffect(() => {
    todoService.getAllTodos().then((allTodos) => {
      sortTodoItems(allTodos);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <div className="active-todo-container" data-testid="active-todo-container">
        <h2 className="todo-heading">To Do list</h2>
        <TodoButton text="Add To do item" handleClick={addTodoItem} />
        {todos.filter((todo) => !todo.done).map((todo) => returnTodoElement(todo))}
      </div>
      <div className="completed-todo-container" data-testid="completed-todo-container">
        <h2 className="todo-heading">Completed tasks</h2>
        {todos.filter((todo) => todo.done).map((todo) => returnTodoElement(todo))}
      </div>
    </div>
  );
};

export default TodoList;
