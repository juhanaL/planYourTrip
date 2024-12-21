import { Router, Request, Response } from 'express';
import Todo from '../models/todo';

interface TodosType {
  text: string;
  id: number;
  placeNumber: number;
  done: boolean;
}

const router = Router();

router.get('/', async (request: Request, response: Response) => {
  const todos = await Todo.findAll();
  response.json(todos);
});

router.get('/:id', async (request: Request, response: Response) => {
  const { id } = request.params;
  const responseTodo = await Todo.findByPk(id);
  if (responseTodo) {
    response.json(responseTodo);
  } else {
    response.status(404).end();
  }
});

router.delete('/:id', async (request: Request, response: Response) => {
  const { id } = request.params;
  await Todo.destroy({ where: { id } });

  response.status(204).end();
});

router.post('/', async (request: Request, response: Response) => {
  const { body } = request;

  if (typeof body.text !== 'string') {
    response.status(400).json({
      error: 'todo text must be a string',
    });
    return;
  }

  if (typeof body.placeNumber !== 'number' || body.placeNumber < 0) {
    response.status(400).json({
      error: 'todo place number must be a positive number',
    });
    return;
  }

  if (typeof body.done !== 'boolean') {
    response.status(400).json({
      error: 'todo done status must be a boolean',
    });
    return;
  }

  const todo = {
    text: body.text,
    placeNumber: body.placeNumber,
    done: body.done,
  };

  try {
    const dBtodo = await Todo.create(todo);
    response.json(dBtodo);
  } catch (error) {
    response.status(400).json({ error });
  }
});

router.put('/:id', async (request: Request, response: Response) => {
  const { id } = request.params;

  const todoToUpdate = await Todo.findByPk(id);

  if (!todoToUpdate) {
    response.status(404).end();
    return;
  }

  const updatedTodo: TodosType = request.body;

  if (updatedTodo.text != null && typeof updatedTodo.text !== 'string') {
    response.status(400).json({
      error: 'todo text must be a string',
    });
    return;
  }

  if (
    updatedTodo.placeNumber != null &&
    (typeof updatedTodo.placeNumber !== 'number' || updatedTodo.placeNumber < 0)
  ) {
    response.status(400).json({
      error: 'todo place number must be a positive number',
    });
    return;
  }

  if (updatedTodo.done != null && typeof updatedTodo.done !== 'boolean') {
    response.status(400).json({
      error: 'todo done status must be a boolean',
    });
    return;
  }

  todoToUpdate.placeNumber = updatedTodo.placeNumber || todoToUpdate.placeNumber;
  todoToUpdate.text = updatedTodo.text || todoToUpdate.text;
  todoToUpdate.done = updatedTodo.done != null ? updatedTodo.done : todoToUpdate.done;

  await todoToUpdate.save();
  response.json(todoToUpdate);
});

export default router;
