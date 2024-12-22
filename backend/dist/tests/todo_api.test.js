"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../utils/config"));
const todo_1 = __importDefault(require("../models/todo"));
const app_1 = __importDefault(require("../app"));
const api = (0, supertest_1.default)(app_1.default);
const user1Token = jsonwebtoken_1.default.sign({ uuid: 'user1' }, `${config_1.default.SECRET}`);
const bogusToken = jsonwebtoken_1.default.sign({ bogus: 'loremIpsum' }, `${config_1.default.SECRET}`);
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
    return Object.assign(Object.assign({}, todo), { id: key + 1 });
});
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield todo_1.default.destroy({ truncate: true, restartIdentity: true });
    yield todo_1.default.create(initialTodos[0]);
    yield todo_1.default.create(initialTodos[1]);
    yield todo_1.default.create(initialTodos[2]);
    yield todo_1.default.create(initialTodos[3]);
    yield todo_1.default.create(initialTodos[4]);
}));
describe('todo API get', () => {
    test('fails with statuscode 400 if no token given', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.get('/api/todos').expect(400);
    }));
    test('fails with statuscode 400 if ill formatted token given', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.get('/api/todos').set('Authorization', `Bearer 123456`).expect(400);
    }));
    test('fails with statuscode 401 if token with wrong contents given', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.get('/api/todos').set('Authorization', `Bearer ${bogusToken}`).expect(401);
    }));
    test('returns todo items of user identified by token, when token ok', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api.get('/api/todos').set('Authorization', `Bearer ${user1Token}`);
        expect(response.body).toStrictEqual(initialTodosWithIds.filter((todo) => todo.user === 'user1'));
    }));
});
describe('todo API get/:id', () => {
    test('fails with statuscode 400 if no token given', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.get('/api/todos/1').expect(400);
    }));
    test('fails with statuscode 400 if ill formatted token given', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.get('/api/todos/1').set('Authorization', `Bearer 123456`).expect(400);
    }));
    test('fails with statuscode 401 if token with wrong contents given', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.get('/api/todos/1').set('Authorization', `Bearer ${bogusToken}`).expect(401);
    }));
    test('returns correct todo item, when token ok and item accessible by this user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api.get('/api/todos/1').set('Authorization', `Bearer ${user1Token}`);
        expect(response.body).toStrictEqual(initialTodosWithIds.find((todo) => todo.id === 1));
    }));
    test('fails with statuscode 404, when token ok but item not accessible by this user', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.get('/api/todos/5').set('Authorization', `Bearer ${user1Token}`).expect(404);
    }));
});
describe('todo API delete/:id', () => {
    test('fails with statuscode 400 if no token given', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.delete('/api/todos/1').expect(400);
    }));
    test('fails with statuscode 400 if ill formatted token given', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.delete('/api/todos/1').set('Authorization', `Bearer 123456`).expect(400);
    }));
    test('fails with statuscode 401 if token with wrong contents given', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.delete('/api/todos/1').set('Authorization', `Bearer ${bogusToken}`).expect(401);
    }));
    test('deletes correct todo item, when token ok and item accessible by this user', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(yield todo_1.default.findByPk(1)).toBeDefined();
        yield api.delete('/api/todos/1').set('Authorization', `Bearer ${user1Token}`).expect(204);
        expect(yield todo_1.default.findByPk(1)).toBeNull();
    }));
    test('does not delete todo item, when token ok but item not accessible by this user', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(yield todo_1.default.findByPk(5)).toBeDefined();
        yield api.get('/api/todos/5').set('Authorization', `Bearer ${user1Token}`).expect(404);
        expect(yield todo_1.default.findByPk(5)).toBeDefined();
    }));
});
describe('todo API post', () => {
    test('fails with statuscode 400 if no token given', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.post('/api/todos').expect(400);
    }));
    test('fails with statuscode 400 if ill formatted token given', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.post('/api/todos').set('Authorization', `Bearer 123456`).expect(400);
    }));
    test('fails with statuscode 401 if token with wrong contents given', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.post('/api/todos').set('Authorization', `Bearer ${bogusToken}`).expect(401);
    }));
    test('creates new todo item, when token ok and request contents ok', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(yield todo_1.default.findByPk(6)).toBeNull();
        const todo = {
            id: 6,
            text: 'test6',
            placeNumber: 6,
            done: false,
            user: 'user1',
        };
        const response = yield api
            .post('/api/todos')
            .set('Authorization', `Bearer ${user1Token}`)
            .send(todo);
        const dbEntry = yield todo_1.default.findByPk(6);
        expect(dbEntry).toBeDefined();
        expect(response.body).toStrictEqual(todo);
        expect(response.body).toStrictEqual(dbEntry === null || dbEntry === void 0 ? void 0 : dbEntry.dataValues);
    }));
    test('fails with statuscode 400 if text missing or in wrong format', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(yield todo_1.default.findByPk(6)).toBeNull();
        const todoWithoutText = {
            id: 6,
            placeNumber: 6,
            done: false,
            user: 'user1',
        };
        yield api
            .post('/api/todos')
            .set('Authorization', `Bearer ${user1Token}`)
            .send(todoWithoutText)
            .expect(400);
        expect(yield todo_1.default.findByPk(6)).toBeNull();
        const todoWithBadText = {
            id: 6,
            text: 0,
            placeNumber: 6,
            done: false,
            user: 'user1',
        };
        yield api
            .post('/api/todos')
            .set('Authorization', `Bearer ${user1Token}`)
            .send(todoWithBadText)
            .expect(400);
        expect(yield todo_1.default.findByPk(6)).toBeNull();
    }));
    test('fails with statuscode 400 if placeNumber missing or in wrong format', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(yield todo_1.default.findByPk(6)).toBeNull();
        const todoWithoutPlaceNumber = {
            id: 6,
            text: 'test6',
            done: false,
            user: 'user1',
        };
        yield api
            .post('/api/todos')
            .set('Authorization', `Bearer ${user1Token}`)
            .send(todoWithoutPlaceNumber)
            .expect(400);
        expect(yield todo_1.default.findByPk(6)).toBeNull();
        const todoWithBadPlaceNumber = {
            id: 6,
            text: 'test6',
            placeNumber: '6',
            done: false,
            user: 'user1',
        };
        yield api
            .post('/api/todos')
            .set('Authorization', `Bearer ${user1Token}`)
            .send(todoWithBadPlaceNumber)
            .expect(400);
        expect(yield todo_1.default.findByPk(6)).toBeNull();
        const todoWithNegativePlaceNumber = {
            id: 6,
            text: 'test6',
            placeNumber: -3,
            done: false,
            user: 'user1',
        };
        yield api
            .post('/api/todos')
            .set('Authorization', `Bearer ${user1Token}`)
            .send(todoWithNegativePlaceNumber)
            .expect(400);
        expect(yield todo_1.default.findByPk(6)).toBeNull();
    }));
    test('fails with statuscode 400 if done status missing or in wrong format', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(yield todo_1.default.findByPk(6)).toBeNull();
        const todoWithoutDone = {
            id: 6,
            text: 'test6',
            placeNumber: 6,
            user: 'user1',
        };
        yield api
            .post('/api/todos')
            .set('Authorization', `Bearer ${user1Token}`)
            .send(todoWithoutDone)
            .expect(400);
        expect(yield todo_1.default.findByPk(6)).toBeNull();
        const todoWithBadDone = {
            id: 6,
            text: 'test6',
            placeNumber: 6,
            user: 'user1',
            done: 'false',
        };
        yield api
            .post('/api/todos')
            .set('Authorization', `Bearer ${user1Token}`)
            .send(todoWithBadDone)
            .expect(400);
        expect(yield todo_1.default.findByPk(6)).toBeNull();
    }));
});
describe('todo API put', () => {
    test('fails with statuscode 400 if no token given', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.put('/api/todos/1').expect(400);
    }));
    test('fails with statuscode 400 if ill formatted token given', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.put('/api/todos/1').set('Authorization', `Bearer 123456`).expect(400);
    }));
    test('fails with statuscode 401 if token with wrong contents given', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.put('/api/todos/1').set('Authorization', `Bearer ${bogusToken}`).expect(401);
    }));
    test('fails with statuscode 404, when token ok but item not accessible by this user', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.put('/api/todos/5').set('Authorization', `Bearer ${user1Token}`).expect(404);
    }));
    test('updates an existing todo item, when token ok and request contents ok', () => __awaiter(void 0, void 0, void 0, function* () {
        const todo = {
            id: 1,
            text: 'new text',
            placeNumber: 600,
            done: true,
            user: 'user1',
        };
        const response = yield api
            .put('/api/todos/1')
            .set('Authorization', `Bearer ${user1Token}`)
            .send(todo);
        const dbEntry = yield todo_1.default.findByPk(1);
        expect(dbEntry).toBeDefined();
        expect(response.body).toStrictEqual(todo);
        expect(response.body).toStrictEqual(dbEntry === null || dbEntry === void 0 ? void 0 : dbEntry.dataValues);
    }));
    test('fails with statuscode 400 if text in wrong format', () => __awaiter(void 0, void 0, void 0, function* () {
        const todo = {
            id: 1,
            text: 600,
            placeNumber: 600,
            done: true,
            user: 'user1',
        };
        yield api
            .put('/api/todos/1')
            .set('Authorization', `Bearer ${user1Token}`)
            .send(todo)
            .expect(400);
    }));
    test('fails with statuscode 400 if placeNumber in wrong format', () => __awaiter(void 0, void 0, void 0, function* () {
        const todoWithBadPlaceNumber = {
            id: 1,
            text: 'new text',
            placeNumber: '6',
            done: true,
            user: 'user1',
        };
        yield api
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
        yield api
            .put('/api/todos/1')
            .set('Authorization', `Bearer ${user1Token}`)
            .send(todoWithNegativePlaceNumber)
            .expect(400);
    }));
    test('fails with statuscode 400 if done status in wrong format', () => __awaiter(void 0, void 0, void 0, function* () {
        const todo = {
            id: 1,
            text: 'new text',
            placeNumber: 600,
            done: 'true',
            user: 'user1',
        };
        yield api
            .put('/api/todos/1')
            .set('Authorization', `Bearer ${user1Token}`)
            .send(todo)
            .expect(400);
    }));
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield todo_1.default.destroy({ truncate: true, restartIdentity: true });
}));
