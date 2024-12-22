"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./utils/config"));
const todos_1 = __importDefault(require("./controllers/todos"));
const weather_1 = __importDefault(require("./controllers/weather"));
const login_1 = __importDefault(require("./controllers/login"));
const catchAll_1 = __importDefault(require("./controllers/catchAll"));
const resetTestDb_1 = __importDefault(require("./controllers/resetTestDb"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static('dist'));
app.use('/api/todos', todos_1.default);
app.use('/api/weather', weather_1.default);
app.use('/api/login', login_1.default);
if (config_1.default.NODE_ENV === 'test') {
    app.use('/api/testing', resetTestDb_1.default);
}
app.use('/*', catchAll_1.default);
exports.default = app;
