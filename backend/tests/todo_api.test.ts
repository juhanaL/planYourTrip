import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import config from '../utils/config';
import Todo from '../models/todo';
import app from '../app';

const api = supertest(app);

const user1Token = jwt.sign({ uuid: 'user1' }, `${config.SECRET}`);
const bogusToken = jwt.sign({ bogus: 'loremIpsum' }, `${config.SECRET}`);

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

const initialTodosWithIds = initialTodos.map((todo, key) => {
  return { ...todo, id: key + 1 };
});

beforeEach(async () => {
  await Todo.destroy({ truncate: true, restartIdentity: true });

  await Todo.create(initialTodos[0]);
  await Todo.create(initialTodos[1]);
  await Todo.create(initialTodos[2]);
  await Todo.create(initialTodos[3]);
  await Todo.create(initialTodos[4]);
});

describe('todo API get', () => {
  test('fails with statuscode 400 if no token given', async () => {
    await api.get('/api/todos').expect(400);
  });

  test('fails with statuscode 400 if ill formatted token given', async () => {
    await api.get('/api/todos').set('Authorization', `Bearer 123456`).expect(400);
  });

  test('fails with statuscode 401 if token with wrong contents given', async () => {
    await api.get('/api/todos').set('Authorization', `Bearer ${bogusToken}`).expect(401);
  });

  test('returns todo items of user identified by token, when token ok', async () => {
    const response = await api.get('/api/todos').set('Authorization', `Bearer ${user1Token}`);
    expect(response.body).toStrictEqual(
      initialTodosWithIds.filter((todo) => todo.user === 'user1')
    );
  });
});

describe('todo API get/:id', () => {
  test('fails with statuscode 400 if no token given', async () => {
    await api.get('/api/todos/1').expect(400);
  });

  test('fails with statuscode 400 if ill formatted token given', async () => {
    await api.get('/api/todos/1').set('Authorization', `Bearer 123456`).expect(400);
  });

  test('fails with statuscode 401 if token with wrong contents given', async () => {
    await api.get('/api/todos/1').set('Authorization', `Bearer ${bogusToken}`).expect(401);
  });

  test('returns correct todo item, when token ok and item accessible by this user', async () => {
    const response = await api.get('/api/todos/1').set('Authorization', `Bearer ${user1Token}`);
    expect(response.body).toStrictEqual(initialTodosWithIds.find((todo) => todo.id === 1));
  });

  test('fails with statuscode 404, when token ok but item not accessible by this user', async () => {
    await api.get('/api/todos/5').set('Authorization', `Bearer ${user1Token}`).expect(404);
  });
});

describe('todo API delete/:id', () => {
  test('fails with statuscode 400 if no token given', async () => {
    await api.delete('/api/todos/1').expect(400);
  });

  test('fails with statuscode 400 if ill formatted token given', async () => {
    await api.delete('/api/todos/1').set('Authorization', `Bearer 123456`).expect(400);
  });

  test('fails with statuscode 401 if token with wrong contents given', async () => {
    await api.delete('/api/todos/1').set('Authorization', `Bearer ${bogusToken}`).expect(401);
  });

  test('deletes correct todo item, when token ok and item accessible by this user', async () => {
    expect(await Todo.findByPk(1)).toBeDefined();
    await api.delete('/api/todos/1').set('Authorization', `Bearer ${user1Token}`).expect(204);
    expect(await Todo.findByPk(1)).toBeNull();
  });

  test('does not delete todo item, when token ok but item not accessible by this user', async () => {
    expect(await Todo.findByPk(5)).toBeDefined();
    await api.get('/api/todos/5').set('Authorization', `Bearer ${user1Token}`).expect(404);
    expect(await Todo.findByPk(5)).toBeDefined();
  });
});

describe('todo API post', () => {
  test('fails with statuscode 400 if no token given', async () => {
    await api.post('/api/todos').expect(400);
  });

  test('fails with statuscode 400 if ill formatted token given', async () => {
    await api.post('/api/todos').set('Authorization', `Bearer 123456`).expect(400);
  });

  test('fails with statuscode 401 if token with wrong contents given', async () => {
    await api.post('/api/todos').set('Authorization', `Bearer ${bogusToken}`).expect(401);
  });

  test('creates new todo item, when token ok and request contents ok', async () => {
    expect(await Todo.findByPk(6)).toBeNull();

    const todo = {
      id: 6,
      text: 'test6',
      placeNumber: 6,
      done: false,
      user: 'user1',
    };

    const response = await api
      .post('/api/todos')
      .set('Authorization', `Bearer ${user1Token}`)
      .send(todo);

    const dbEntry = await Todo.findByPk(6);
    expect(dbEntry).toBeDefined();
    expect(response.body).toStrictEqual(todo);
    expect(response.body).toStrictEqual(dbEntry?.dataValues);
  });

  test('fails with statuscode 400 if text missing or in wrong format', async () => {
    expect(await Todo.findByPk(6)).toBeNull();

    const todoWithoutText = {
      id: 6,
      placeNumber: 6,
      done: false,
      user: 'user1',
    };

    await api
      .post('/api/todos')
      .set('Authorization', `Bearer ${user1Token}`)
      .send(todoWithoutText)
      .expect(400);

    expect(await Todo.findByPk(6)).toBeNull();

    const todoWithBadText = {
      id: 6,
      text: 0,
      placeNumber: 6,
      done: false,
      user: 'user1',
    };

    await api
      .post('/api/todos')
      .set('Authorization', `Bearer ${user1Token}`)
      .send(todoWithBadText)
      .expect(400);

    expect(await Todo.findByPk(6)).toBeNull();
  });

  test('fails with statuscode 400 if placeNumber missing or in wrong format', async () => {
    expect(await Todo.findByPk(6)).toBeNull();

    const todoWithoutPlaceNumber = {
      id: 6,
      text: 'test6',
      done: false,
      user: 'user1',
    };

    await api
      .post('/api/todos')
      .set('Authorization', `Bearer ${user1Token}`)
      .send(todoWithoutPlaceNumber)
      .expect(400);

    expect(await Todo.findByPk(6)).toBeNull();

    const todoWithBadPlaceNumber = {
      id: 6,
      text: 'test6',
      placeNumber: '6',
      done: false,
      user: 'user1',
    };

    await api
      .post('/api/todos')
      .set('Authorization', `Bearer ${user1Token}`)
      .send(todoWithBadPlaceNumber)
      .expect(400);

    expect(await Todo.findByPk(6)).toBeNull();

    const todoWithNegativePlaceNumber = {
      id: 6,
      text: 'test6',
      placeNumber: -3,
      done: false,
      user: 'user1',
    };

    await api
      .post('/api/todos')
      .set('Authorization', `Bearer ${user1Token}`)
      .send(todoWithNegativePlaceNumber)
      .expect(400);

    expect(await Todo.findByPk(6)).toBeNull();
  });

  test('fails with statuscode 400 if done status missing or in wrong format', async () => {
    expect(await Todo.findByPk(6)).toBeNull();

    const todoWithoutDone = {
      id: 6,
      text: 'test6',
      placeNumber: 6,
      user: 'user1',
    };

    await api
      .post('/api/todos')
      .set('Authorization', `Bearer ${user1Token}`)
      .send(todoWithoutDone)
      .expect(400);

    expect(await Todo.findByPk(6)).toBeNull();

    const todoWithBadDone = {
      id: 6,
      text: 'test6',
      placeNumber: 6,
      user: 'user1',
      done: 'false',
    };

    await api
      .post('/api/todos')
      .set('Authorization', `Bearer ${user1Token}`)
      .send(todoWithBadDone)
      .expect(400);

    expect(await Todo.findByPk(6)).toBeNull();
  });
});

describe('todo API put', () => {
  test('fails with statuscode 400 if no token given', async () => {
    await api.put('/api/todos/1').expect(400);
  });

  test('fails with statuscode 400 if ill formatted token given', async () => {
    await api.put('/api/todos/1').set('Authorization', `Bearer 123456`).expect(400);
  });

  test('fails with statuscode 401 if token with wrong contents given', async () => {
    await api.put('/api/todos/1').set('Authorization', `Bearer ${bogusToken}`).expect(401);
  });

  test('fails with statuscode 404, when token ok but item not accessible by this user', async () => {
    await api.put('/api/todos/5').set('Authorization', `Bearer ${user1Token}`).expect(404);
  });

  test('updates an existing todo item, when token ok and request contents ok', async () => {
    const todo = {
      id: 1,
      text: 'new text',
      placeNumber: 600,
      done: true,
      user: 'user1',
    };

    const response = await api
      .put('/api/todos/1')
      .set('Authorization', `Bearer ${user1Token}`)
      .send(todo);

    const dbEntry = await Todo.findByPk(1);
    expect(dbEntry).toBeDefined();
    expect(response.body).toStrictEqual(todo);
    expect(response.body).toStrictEqual(dbEntry?.dataValues);
  });

  test('fails with statuscode 400 if text in wrong format', async () => {
    const todo = {
      id: 1,
      text: 600,
      placeNumber: 600,
      done: true,
      user: 'user1',
    };

    await api
      .put('/api/todos/1')
      .set('Authorization', `Bearer ${user1Token}`)
      .send(todo)
      .expect(400);
  });

  test('fails with statuscode 400 if placeNumber in wrong format', async () => {
    const todoWithBadPlaceNumber = {
      id: 1,
      text: 'new text',
      placeNumber: '6',
      done: true,
      user: 'user1',
    };

    await api
      .put('/api/todos/1')
      .set('Authorization', `Bearer ${user1Token}`)
      .send(todoWithBadPlaceNumber)
      .expect(400);

    const todoWithNegativePlaceNumber = {
      id: 1,
      text: 'new text',
      placeNumber: -6,
      done: true,
      user: 'user1',
    };

    await api
      .put('/api/todos/1')
      .set('Authorization', `Bearer ${user1Token}`)
      .send(todoWithNegativePlaceNumber)
      .expect(400);
  });

  test('fails with statuscode 400 if done status in wrong format', async () => {
    const todo = {
      id: 1,
      text: 'new text',
      placeNumber: 600,
      done: 'true',
      user: 'user1',
    };

    await api
      .put('/api/todos/1')
      .set('Authorization', `Bearer ${user1Token}`)
      .send(todo)
      .expect(400);
  });
});

afterAll(async () => {
  await Todo.destroy({ truncate: true, restartIdentity: true });
});
