import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import todoService from '../services/todos';

import '../styles/TodoItem.css';

interface Props {
  todoText: string;
  id: number;
  done: boolean;
  removeTodoItem: (arg0: number) => void;
  changeTodoText: (arf0: number, arg1: string) => void;
  toggleDone: (arf0: number, arg1: boolean) => void;
  setCoordinates: (arf0: number, arg1: number) => void;
  reallocatePlaceNumbers: (arg0: number) => void;
  placeNumber: number;
}

const TodoItem = ({
  todoText,
  id,
  done,
  removeTodoItem,
  changeTodoText,
  toggleDone,
  setCoordinates,
  reallocatePlaceNumbers,
  placeNumber,
}: Props) => {
  const [draggable, setDraggable] = useState<boolean>(false);

  const todoItemRef = useRef<HTMLDivElement>(null);
  const scrollUpRef = useRef<boolean>(false);
  const scrollDownRef = useRef<boolean>(false);
  const scrollCallerRef = useRef<number>(0);
  const mouseOrTouchYRef = useRef<number>(0);
  const lastMouseOrTouchYCoordRef = useRef<number>(0);

  const changeTodo = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    changeTodoText(id, event.target.value);
  };

  const changeDone = (event: React.ChangeEvent<HTMLInputElement>) => {
    toggleDone(id, event.target.checked);
  };

  const getAvgYCoordinates = () => {
    let avgYCoordinate = 0;
    if (todoItemRef.current) {
      const rect = todoItemRef.current.getBoundingClientRect();
      avgYCoordinate = (rect.top + rect.bottom) / 2;
    }
    return avgYCoordinate;
  };

  const setAvgYCoordinates = () => {
    setCoordinates(id, getAvgYCoordinates());
  };

  const changeElementTop = (mouseYPos: number) => {
    if (todoItemRef.current) {
      const yCoordRef = getAvgYCoordinates() - (parseFloat(todoItemRef.current.style.top) || 0); // This is the reference coordinate of the relative position. Current absolute position - value for relative top property.
      const newTop = `${mouseYPos - yCoordRef}px`; // New value for relative top proerty. Mouse Y-position - reference coordinate of the relative position.
      todoItemRef.current.style.top = newTop;
    }
  };

  const autoScroll = (callerId: number, scrollSpeed: number) => {
    if (scrollCallerRef.current !== callerId) return;
    if (!scrollDownRef.current && !scrollUpRef.current) return;

    const scrollSpeedAndDirection = scrollUpRef.current ? -scrollSpeed : scrollSpeed;

    const mainContentContainer = document.getElementById('main-content');
    if (mainContentContainer && todoItemRef.current) {
      mainContentContainer.scrollBy(0, scrollSpeedAndDirection);
      if (
        mainContentContainer.scrollTop > 0 &&
        mainContentContainer.scrollTop <
          mainContentContainer.scrollHeight - mainContentContainer.offsetHeight
      ) {
        changeElementTop(mouseOrTouchYRef.current);

        setAvgYCoordinates();
        reallocatePlaceNumbers(id);

        setTimeout(() => {
          autoScroll(callerId, scrollSpeed);
        }, 1);
      }
    }
  };

  const changeItemCoordinatesOnMoveEvent = (yCoords: number, movementDirection: number) => {
    if (todoItemRef.current) {
      mouseOrTouchYRef.current = yCoords;
      changeElementTop(mouseOrTouchYRef.current);
      setAvgYCoordinates();
      reallocatePlaceNumbers(id);

      const mainContRect = document.getElementById('main-content')?.getBoundingClientRect();
      const scrollZoneHeight = 0.2 * window.innerHeight;
      const topScrollZone = (mainContRect?.top || 0) + scrollZoneHeight;
      const bottomScrollZone = (mainContRect?.bottom || 0) - scrollZoneHeight;

      if (movementDirection < 0) scrollDownRef.current = false;
      if (movementDirection > 0) scrollUpRef.current = false;

      if (movementDirection < 0 && mouseOrTouchYRef.current < topScrollZone) {
        const scrollSpeed = ((topScrollZone - mouseOrTouchYRef.current) / scrollZoneHeight) * 20;
        scrollUpRef.current = true;
        autoScroll((scrollCallerRef.current += 1), scrollSpeed);
      }

      if (movementDirection > 0 && mouseOrTouchYRef.current > bottomScrollZone) {
        const scrollSpeed = ((mouseOrTouchYRef.current - bottomScrollZone) / scrollZoneHeight) * 20;
        scrollDownRef.current = true;
        autoScroll((scrollCallerRef.current += 1), scrollSpeed);
      }
    }
  };

  const handleMouseMoveEvent = (event: MouseEvent) => {
    const movementYCoord = event.clientY;
    const movementDirection = movementYCoord - lastMouseOrTouchYCoordRef.current;
    lastMouseOrTouchYCoordRef.current = movementYCoord;
    changeItemCoordinatesOnMoveEvent(movementYCoord, movementDirection);
  };

  const handleTouchMoveEvent = (event: TouchEvent) => {
    const movementYCoord = event.changedTouches[0].clientY;
    const movementDirection = movementYCoord - lastMouseOrTouchYCoordRef.current;
    lastMouseOrTouchYCoordRef.current = movementYCoord;
    changeItemCoordinatesOnMoveEvent(movementYCoord, movementDirection);
  };

  const draggableFalseWhenMouseReleased = () => {
    scrollUpRef.current = false;
    scrollDownRef.current = false;
    if (todoItemRef.current) {
      todoItemRef.current.style.top = '0px';
    }
    setDraggable(false);
    document.removeEventListener('mouseup', draggableFalseWhenMouseReleased);
    document.removeEventListener('mousemove', handleMouseMoveEvent);
  };

  const draggableTrueWhenMouseClicked = (event: React.MouseEvent<HTMLElement>) => {
    event?.preventDefault();

    if (todoItemRef.current) {
      todoItemRef.current.style.top = '0px';
    }

    lastMouseOrTouchYCoordRef.current = event.clientY;
    setDraggable(true);
    document.addEventListener('mouseup', draggableFalseWhenMouseReleased);
    document.addEventListener('mousemove', handleMouseMoveEvent);
  };

  const draggableFalseWhenTouchEnd = () => {
    scrollUpRef.current = false;
    scrollDownRef.current = false;
    if (todoItemRef.current) {
      todoItemRef.current.style.top = '0px';
    }
    setDraggable(false);
    document.removeEventListener('touchend', draggableFalseWhenTouchEnd);
    document.removeEventListener('touchmove', handleTouchMoveEvent);
  };

  const draggableTrueWhenTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    if (todoItemRef.current) {
      todoItemRef.current.style.top = '0px';
    }

    lastMouseOrTouchYCoordRef.current = event.changedTouches[0].clientY;
    setDraggable(true);
    document.addEventListener('touchend', draggableFalseWhenTouchEnd);
    document.addEventListener('touchmove', handleTouchMoveEvent);
  };

  useEffect(() => {
    setAvgYCoordinates();
  });

  useLayoutEffect(() => {
    if (todoItemRef.current) {
      changeElementTop(mouseOrTouchYRef.current);
    }
    todoService.updatePlaceNumber(id, placeNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeNumber]);

  return (
    <div
      className={`todo-item todo-item-draggable-${draggable}`}
      ref={todoItemRef}
      data-testid={`todo-item-draggable-${draggable}`}
    >
      <i
        className="fa fa-sort"
        data-testid={`${id}-sortIcon`}
        role="presentation"
        onMouseDown={draggableTrueWhenMouseClicked}
        onTouchStart={draggableTrueWhenTouchStart}
      />
      <input
        id={`${id}-checkbox`}
        data-testid={`${id}-checkbox`}
        type="checkbox"
        className="todo-done-checkbox"
        checked={done}
        onChange={changeDone}
      />
      <TextareaAutosize
        id={`${id}-textarea`}
        data-testid={`${id}-textarea`}
        className="todo-text"
        placeholder="To do item"
        value={todoText}
        onChange={changeTodo}
      />
      <i
        className="fa fa-close"
        role="button"
        aria-label="remove todo item button"
        data-testid={`${id}-removeButton`}
        tabIndex={0}
        onClick={() => removeTodoItem(id)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            removeTodoItem(id);
          }
        }}
      />
    </div>
  );
};

export default TodoItem;
