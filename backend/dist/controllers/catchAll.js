"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
router.get('/', (request, response) => {
    const directoryEndPath = __dirname.includes('dist') ? '../index.html' : '../dist/index.html';
    response.sendFile(path_1.default.join(__dirname, directoryEndPath), (error) => {
        if (error) {
            response.status(500).send(error);
        }
    });
});
exports.default = router;
