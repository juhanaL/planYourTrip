import supertest from 'supertest';
import app from '../app';
import Todo from '../models/todo';

const api = supertest(app);

const initialTodos = [
  {
    text: 'test1',
    placeNumber: 1,
    done: false,
    user: 'user1',
  },
  {
    text: 'test2',
    placeNumber: 2,
    done: false,
    user: 'user1',
  },
  {
    text: 'test3',
    placeNumber: 3,
    done: false,
    user: 'user1',
  },
  {
    text: 'test4',
    placeNumber: 1,
    done: false,
    user: 'user2',
  },
  {
    text: 'test5',
    placeNumber: 2,
    done: false,
    user: 'user2',
  },
];

beforeEach(async () => {
  await Todo.destroy({ truncate: true, restartIdentity: true });

  await Todo.create(initialTodos[0]);
  await Todo.create(initialTodos[1]);
  await Todo.create(initialTodos[2]);
  await Todo.create(initialTodos[3]);
  await Todo.create(initialTodos[4]);
});

describe('Reset test DB API post', () => {
  test('empties database and returns status code 204', async () => {
    const result1 = await Todo.findAll();
    expect(result1).toHaveLength(5);

    await api.post('/api/testing/reset').expect(204);

    const result2 = await Todo.findAll();
    expect(result2).toHaveLength(0);
  });
});

afterAll(async () => {
  await Todo.destroy({ truncate: true, restartIdentity: true });
});
