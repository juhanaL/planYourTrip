"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { PORT } = process.env;
const { WEATHER_API_KEY } = process.env;
const { X_WINDY_API_KEY } = process.env;
const { DATABASE_URL } = process.env;
const { SECRET } = process.env;
exports.default = {
    PORT,
    WEATHER_API_KEY,
    X_WINDY_API_KEY,
    DATABASE_URL,
    SECRET,
};
