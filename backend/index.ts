import express, { Express, Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

interface TodosType {
  text: string;
  id: string;
  placeNumber: number;
  done: boolean;
}

let todos: TodosType[] = [
  { text: 'test1', id: '0', placeNumber: 2, done: false },
  { text: 'test2', id: '1', placeNumber: 3, done: true },
  { text: 'test3', id: '2', placeNumber: 1, done: false },
];

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

app.get('/api/todos', (request: Request, response: Response) => {
  response.json(todos);
});

app.get('/api/todos/:id', (request: Request, response: Response) => {
  const { id } = request.params;
  const responseTodo = todos.find((todo) => todo.id === id);
  if (responseTodo) {
    response.json(responseTodo);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/todos/:id', (request: Request, response: Response) => {
  const { id } = request.params;
  todos = todos.filter((todo) => todo.id !== id);

  response.status(204).end();
});

app.post('/api/todos', (request: Request, response: Response) => {
  const maxId = todos.length > 0 ? Math.max(...todos.map((n) => Number(n.id))) : 0;

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
    id: String(maxId + 1),
    text: body.text,
    placeNumber: body.placeNumber,
    done: body.done,
  };

  todos = todos.concat(todo);

  response.json(todo);
});

app.put('/api/todos/:id', (request: Request, response: Response) => {
  const { id } = request.params;

  const todoToUpdate = todos.find((todo) => todo.id === id);

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

  todos = todos.map((todo) => {
    if (todo.id !== id) {
      return todo;
    }
    return todoToUpdate;
  });

  response.json(todoToUpdate);
});

app.get('/api/weather', (request: Request, response: Response) => {
  const { lat } = request.query;
  const { lng } = request.query;

  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
    response.status(400).json({
      error: 'coordinates must be included and numbers',
    });
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.WEATHER_API_KEY}&units=metric`;

  const axiosRequest = axios.get(url);
  axiosRequest
    .then((axiosResponse) => response.json(axiosResponse.data))
    .catch((axiosError) =>
      response.status(axiosError.response.status).json({ error: `Fetching weather data failed.` })
    );
});

app.get('/api/name', (request: Request, response: Response) => {
  const { lat } = request.query;
  const { lng } = request.query;

  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
    response.status(400).json({
      error: 'coordinates must be included and numbers',
    });
    return;
  }

  const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${process.env.WEATHER_API_KEY}`;

  const axiosRequest = axios.get(url);
  axiosRequest
    .then((axiosResponse) => response.json(axiosResponse.data))
    .catch((axiosError) =>
      response.status(axiosError.response.status).json({ error: `Fetching name data failed.` })
    );
});

app.get('/api/time', (request: Request, response: Response) => {
  const { lat } = request.query;
  const { lng } = request.query;

  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
    response.status(400).json({
      error: 'coordinates must be included and numbers',
    });
    return;
  }

  const url = `https://timeapi.io/api/time/current/coordinate?latitude=${lat}&longitude=${lng}`;

  const axiosRequest = axios.get(url);
  axiosRequest
    .then((axiosResponse) => response.json(axiosResponse.data))
    .catch((axiosError) =>
      response.status(axiosError.response.status).json({ error: `Fetching time data failed.` })
    );
});

app.get('/api/webcam', (request: Request, response: Response) => {
  const { lat } = request.query;
  const { lng } = request.query;

  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
    response.status(400).json({
      error: 'coordinates must be included and numbers',
    });
    return;
  }

  const url = `https://api.windy.com/webcams/api/v3/webcams?lang=en&limit=10&offset=0&nearby=${lat}%2C${lng}%2C250&categories=meteo&include=images`;

  const axiosRequest = axios.get(url, {
    headers: { 'x-windy-api-key': `${process.env.X_WINDY_API_KEY}` },
  });
  axiosRequest
    .then((axiosResponse) => response.json(axiosResponse.data))
    .catch((axiosError) =>
      response.status(axiosError.response.status).json({ error: `Fetching webcam picture failed.` })
    );
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
