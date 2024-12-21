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
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const todo_1 = __importDefault(require("../models/todo"));
const router = (0, express_1.Router)();
const getTokenFrom = (request) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '');
    }
    return '';
};
router.get('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decodedToken = jsonwebtoken_1.default.verify(getTokenFrom(request), `${process.env.SECRET}`);
        if (!decodedToken.uuid) {
            response.status(401).json({ error: 'token invalid' });
            return;
        }
        const todos = yield todo_1.default.findAll({ where: { user: decodedToken.uuid } });
        response.json(todos);
    }
    catch (_a) {
        response.status(400).json({ error: 'token missing or invalid' });
    }
}));
router.get('/:id', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decodedToken = jsonwebtoken_1.default.verify(getTokenFrom(request), `${process.env.SECRET}`);
        if (!decodedToken.uuid) {
            response.status(401).json({ error: 'token invalid' });
            return;
        }
        const { id } = request.params;
        const responseTodo = yield todo_1.default.findOne({ where: { id, user: decodedToken.uuid } });
        if (responseTodo) {
            response.json(responseTodo);
        }
        else {
            response.status(404).end();
        }
    }
    catch (_a) {
        response.status(400).json({ error: 'token missing or invalid' });
    }
}));
router.delete('/:id', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decodedToken = jsonwebtoken_1.default.verify(getTokenFrom(request), `${process.env.SECRET}`);
        if (!decodedToken.uuid) {
            response.status(401).json({ error: 'token invalid' });
            return;
        }
        const { id } = request.params;
        yield todo_1.default.destroy({ where: { id, user: decodedToken.uuid } });
        response.status(204).end();
    }
    catch (_a) {
        response.status(400).json({ error: 'token missing or invalid' });
    }
}));
router.post('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decodedToken = jsonwebtoken_1.default.verify(getTokenFrom(request), `${process.env.SECRET}`);
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
            const dBtodo = yield todo_1.default.create(todo);
            response.json(dBtodo);
        }
        catch (error) {
            response.status(400).json({ error });
        }
    }
    catch (_a) {
        response.status(400).json({ error: 'token missing or invalid' });
    }
}));
router.put('/:id', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decodedToken = jsonwebtoken_1.default.verify(getTokenFrom(request), `${process.env.SECRET}`);
        if (!decodedToken.uuid) {
            response.status(401).json({ error: 'token invalid' });
            return;
        }
        const { id } = request.params;
        const todoToUpdate = yield todo_1.default.findOne({ where: { id, user: decodedToken.uuid } });
        if (!todoToUpdate) {
            response.status(404).end();
            return;
        }
        const updatedTodo = request.body;
        if (updatedTodo.text != null && typeof updatedTodo.text !== 'string') {
            response.status(400).json({
                error: 'todo text must be a string',
            });
            return;
        }
        if (updatedTodo.placeNumber != null &&
            (typeof updatedTodo.placeNumber !== 'number' || updatedTodo.placeNumber < 0)) {
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
        yield todoToUpdate.save();
        response.json(todoToUpdate);
    }
    catch (_a) {
        response.status(400).json({ error: 'token missing or invalid' });
    }
}));
exports.default = router;
