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
describe('weather API get weather', () => {
    test('fails with statuscode 400 if coordinates not given as parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.get('/api/weather/weather').expect(400);
    }));
    test('fails with statuscode 400 if coordinates given as parameters in non numeric format', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.get('/api/weather/weather?lat=kuuskyt&lng=kaksnelja').expect(400);
    }));
    test('fails with statuscode 400 if openweathermap api returns error', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api
            .get('/api/weather/weather?lat=6000000000000000000000&lng=2444444444444444444444444444444444')
            .expect(400);
    }));
    test('succeeds if legit coordinates given as parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api.get('/api/weather/weather?lat=60.1797&lng=24.9344');
        expect(response.body.name).toStrictEqual('Helsinki');
    }));
    test('succeeds if legit coordinates given as parameters even if other parameters are given also', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api.get('/api/weather/weather?lat=60.1797&lng=24.9344&random=random');
        expect(response.body.name).toStrictEqual('Helsinki');
    }));
});
describe('weather API get name', () => {
    test('fails with statuscode 400 if coordinates not given as parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.get('/api/weather/name').expect(400);
    }));
    test('fails with statuscode 400 if coordinates given as parameters in non numeric format', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.get('/api/weather/name?lat=kuuskyt&lng=kaksnelja').expect(400);
    }));
    test('fails with statuscode 400 if openweathermap api returns error', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api
            .get('/api/weather/name?lat=6000000000000000000000&lng=2444444444444444444444444444444444')
            .expect(400);
    }));
    test('succeeds if legit coordinates given as parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api.get('/api/weather/name?lat=60.1797&lng=24.9344');
        expect(response.body[0].name).toStrictEqual('Helsinki');
    }));
    test('succeeds if legit coordinates given as parameters even if other parameters are given also', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api.get('/api/weather/name?lat=60.1797&lng=24.9344&random=random');
        expect(response.body[0].name).toStrictEqual('Helsinki');
    }));
});
describe('weather API get time', () => {
    test('fails with statuscode 400 if coordinates not given as parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.get('/api/weather/time').expect(400);
    }));
    test('fails with statuscode 400 if coordinates given as parameters in non numeric format', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.get('/api/weather/time?lat=kuuskyt&lng=kaksnelja').expect(400);
    }));
    test('fails with statuscode 400 if openweathermap api returns error', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api
            .get('/api/weather/time?lat=6000000000000000000000&lng=2444444444444444444444444444444444')
            .expect(400);
    }));
    test('succeeds if legit coordinates given as parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api.get('/api/weather/time?lat=60.1797&lng=24.9344');
        expect(response.body.timeZone).toStrictEqual('Europe/Helsinki');
    }));
    test('succeeds if legit coordinates given as parameters even if other parameters are given also', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api.get('/api/weather/time?lat=60.1797&lng=24.9344&random=random');
        expect(response.body.timeZone).toStrictEqual('Europe/Helsinki');
    }));
});
describe('weather API get webcam', () => {
    test('fails with statuscode 400 if coordinates not given as parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.get('/api/weather/webcam').expect(400);
    }));
    test('fails with statuscode 400 if coordinates given as parameters in non numeric format', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.get('/api/weather/webcam?lat=kuuskyt&lng=kaksnelja').expect(400);
    }));
    test('fails with statuscode 400 if openweathermap api returns error', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api
            .get('/api/weather/webcam?lat=6000000000000000000000&lng=2444444444444444444444444444444444')
            .expect(400);
    }));
    test('succeeds if legit coordinates given as parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api.get('/api/weather/webcam?lat=60.1797&lng=24.9344');
        expect(Array.isArray(response.body.webcams)).toBeTruthy();
    }));
    test('succeeds if legit coordinates given as parameters even if other parameters are given also', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api.get('/api/weather/webcam?lat=60.1797&lng=24.9344&random=random');
        expect(Array.isArray(response.body.webcams)).toBeTruthy();
    }));
});
