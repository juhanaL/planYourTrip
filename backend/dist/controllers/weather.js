"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../utils/config"));
const router = (0, express_1.Router)();
router.get('/weather', (request, response) => {
    const { lat } = request.query;
    const { lng } = request.query;
    if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
        response.status(400).json({
            error: 'coordinates must be included and numbers',
        });
        return;
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${config_1.default.WEATHER_API_KEY}&units=metric`;
    const axiosRequest = axios_1.default.get(url);
    axiosRequest
        .then((axiosResponse) => response.json(axiosResponse.data))
        .catch((axiosError) => response.status(axiosError.response.status).json({ error: `Fetching weather data failed.` }));
});
router.get('/name', (request, response) => {
    const { lat } = request.query;
    const { lng } = request.query;
    if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
        response.status(400).json({
            error: 'coordinates must be included and numbers',
        });
        return;
    }
    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${config_1.default.WEATHER_API_KEY}`;
    const axiosRequest = axios_1.default.get(url);
    axiosRequest
        .then((axiosResponse) => response.json(axiosResponse.data))
        .catch((axiosError) => response.status(axiosError.response.status).json({ error: `Fetching name data failed.` }));
});
router.get('/time', (request, response) => {
    const { lat } = request.query;
    const { lng } = request.query;
    if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
        response.status(400).json({
            error: 'coordinates must be included and numbers',
        });
        return;
    }
    const url = `https://timeapi.io/api/time/current/coordinate?latitude=${lat}&longitude=${lng}`;
    const axiosRequest = axios_1.default.get(url);
    axiosRequest
        .then((axiosResponse) => response.json(axiosResponse.data))
        .catch((axiosError) => response.status(axiosError.response.status).json({ error: `Fetching time data failed.` }));
});
router.get('/webcam', (request, response) => {
    const { lat } = request.query;
    const { lng } = request.query;
    if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
        response.status(400).json({
            error: 'coordinates must be included and numbers',
        });
        return;
    }
    const url = `https://api.windy.com/webcams/api/v3/webcams?lang=en&limit=10&offset=0&nearby=${lat}%2C${lng}%2C250&categories=meteo&include=images`;
    const axiosRequest = axios_1.default.get(url, {
        headers: { 'x-windy-api-key': `${config_1.default.X_WINDY_API_KEY}` },
    });
    axiosRequest
        .then((axiosResponse) => response.json(axiosResponse.data))
        .catch((axiosError) => response.status(axiosError.response.status).json({ error: `Fetching webcam picture failed.` }));
});
exports.default = router;
