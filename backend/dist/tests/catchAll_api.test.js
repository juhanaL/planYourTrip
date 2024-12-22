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
describe('catchAll API get', () => {
    test('requests to "/" get status code 200', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.get('/').expect(200);
    }));
    test('requests to "/todo" get status code 200', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.get('/todo').expect(200);
    }));
    test('requests to "/todo" get status code 200', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.get('/weathermap').expect(200);
    }));
});
