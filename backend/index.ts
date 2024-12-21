import express, { Express, Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import {
  Sequelize,
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

interface TodosType {
  text: string;
  id: number;
  placeNumber: number;
  done: boolean;
}

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

const sequelize = new Sequelize(`${process.env.DATABASE_URL}`);

class Todo extends Model<InferAttributes<Todo>, InferCreationAttributes<Todo>> {
  declare id: CreationOptional<number>;

  declare text: string;

  declare placeNumber: number;

  declare done: boolean;
}

Todo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    placeNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    done: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'todo',
  }
);

Todo.sync();

app.get('/api/todos', async (request: Request, response: Response) => {
  const todos = await Todo.findAll();
  response.json(todos);
});

app.get('/api/todos/:id', async (request: Request, response: Response) => {
  const { id } = request.params;
  const responseTodo = await Todo.findByPk(id);
  if (responseTodo) {
    response.json(responseTodo);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/todos/:id', async (request: Request, response: Response) => {
  const { id } = request.params;
  await Todo.destroy({ where: { id } });

  response.status(204).end();
});

app.post('/api/todos', async (request: Request, response: Response) => {
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

app.put('/api/todos/:id', async (request: Request, response: Response) => {
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

app.get('/api/weather/weather', (request: Request, response: Response) => {
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

app.get('/api/weather/name', (request: Request, response: Response) => {
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

app.get('/api/weather/time', (request: Request, response: Response) => {
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

app.get('/api/weather/webcam', (request: Request, response: Response) => {
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

app.get('/*', (request: Request, response: Response) => {
  response.sendFile(path.join(__dirname, 'dist/index.html'), (error) => {
    if (error) {
      response.status(500).send(error);
    }
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
