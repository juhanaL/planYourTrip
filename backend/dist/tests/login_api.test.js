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
const api = (0, supertest_1.default)(app_1.default);
describe('login API post', () => {
    test('fails with statuscode 401 if no uuid is sent', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.post('/api/login').expect(401);
    }));
    test('fails with statuscode 401 if non-string uuid is sent', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.post('/api/login').send({ uuid: 123 }).expect(401);
    }));
    test('succeeds when string format uuid is sent', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api.post('/api/login').send({ uuid: '123' });
        expect(response.body.uuid).toBe('123');
    }));
});
