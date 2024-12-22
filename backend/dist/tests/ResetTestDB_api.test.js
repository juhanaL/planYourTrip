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
const app_1 = __importDefault(require("../app"));
const todo_1 = __importDefault(require("../models/todo"));
const api = (0, supertest_1.default)(app_1.default);
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
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield todo_1.default.destroy({ truncate: true, restartIdentity: true });
    yield todo_1.default.create(initialTodos[0]);
    yield todo_1.default.create(initialTodos[1]);
    yield todo_1.default.create(initialTodos[2]);
    yield todo_1.default.create(initialTodos[3]);
    yield todo_1.default.create(initialTodos[4]);
}));
describe('Reset test DB API post', () => {
    test('empties database and returns status code 204', () => __awaiter(void 0, void 0, void 0, function* () {
        const result1 = yield todo_1.default.findAll();
        expect(result1).toHaveLength(5);
        yield api.post('/api/testing/reset').expect(204);
        const result2 = yield todo_1.default.findAll();
        expect(result2).toHaveLength(0);
    }));
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield todo_1.default.destroy({ truncate: true, restartIdentity: true });
}));
