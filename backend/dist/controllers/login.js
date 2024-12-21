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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = require("express");
const config_1 = __importDefault(require("../utils/config"));
const router = (0, express_1.Router)();
router.post('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { uuid } = request.body;
    if (!uuid) {
        response.status(401).json({
            error: 'invalid uuid',
        });
        return;
    }
    const userForToken = {
        uuid,
    };
    const token = jsonwebtoken_1.default.sign(userForToken, `${config_1.default.SECRET}`);
    response.status(200).send({ token, uuid });
}));
exports.default = router;
