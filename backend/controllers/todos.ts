import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Todo from '../models/todo';

interface TodosType {
  text: string;
  id: number;
  placeNumber: number;
  done: boolean;
}

interface JwtPayload {
  uuid: string;
}

const router = Router();

const getTokenFrom = (request: Request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return '';
};

router.get('/', async (request: Request, response: Response) => {
  try {
    const decodedToken = jwt.verify(getTokenFrom(request), `${process.env.SECRET}`) as JwtPayload;

    if (!decodedToken.uuid) {
      response.status(401).json({ error: 'token invalid' });
      return;
    }

    const todos = await Todo.findAll({ where: { user: decodedToken.uuid } });
    response.json(todos);
  } catch {
    response.status(400).json({ error: 'token missing or invalid' });
  }
});

router.get('/:id', async (request: Request, response: Response) => {
  try {
    const decodedToken = jwt.verify(getTokenFrom(request), `${process.env.SECRET}`) as JwtPayload;
    if (!decodedToken.uuid) {
      response.status(401).json({ error: 'token invalid' });
      return;
    }

    const { id } = request.params;
    const responseTodo = await Todo.findOne({ where: { id, user: decodedToken.uuid } });
    if (responseTodo) {
      response.json(responseTodo);
    } else {
      response.status(404).end();
    }
  } catch {
    response.status(400).json({ error: 'token missing or invalid' });
  }
});

router.delete('/:id', async (request: Request, response: Response) => {
  try {
    const decodedToken = jwt.verify(getTokenFrom(request), `${process.env.SECRET}`) as JwtPayload;
    if (!decodedToken.uuid) {
      response.status(401).json({ error: 'token invalid' });
      return;
    }

    const { id } = request.params;
    await Todo.destroy({ where: { id, user: decodedToken.uuid } });

    response.status(204).end();
  } catch {
    response.status(400).json({ error: 'token missing or invalid' });
  }
});

router.post('/', async (request: Request, response: Response) => {
  try {
    const decodedToken = jwt.verify(getTokenFrom(request), `${process.env.SECRET}`) as JwtPayload;
    if (!decodedToken.uuid) {
      response.status(401).json({ error: 'token invalid' });
      return;
    }

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
      user: decodedToken.uuid,
    };

    try {
      const dBtodo = await Todo.create(todo);
      response.json(dBtodo);
    } catch (error) {
      response.status(400).json({ error });
    }
  } catch {
    response.status(400).json({ error: 'token missing or invalid' });
  }
});

router.put('/:id', async (request: Request, response: Response) => {
  try {
    const decodedToken = jwt.verify(getTokenFrom(request), `${process.env.SECRET}`) as JwtPayload;
    if (!decodedToken.uuid) {
      response.status(401).json({ error: 'token invalid' });
      return;
    }

    const { id } = request.params;

    const todoToUpdate = await Todo.findOne({ where: { id, user: decodedToken.uuid } });

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
  } catch {
    response.status(400).json({ error: 'token missing or invalid' });
  }
});

export default router;
