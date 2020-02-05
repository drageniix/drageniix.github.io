"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const body_parser_1 = require("body-parser");
const socket_1 = __importDefault(require("./middleware/socket"));
class App {
    constructor() {
        this.app = express();
        this.app.use(body_parser_1.urlencoded({ extended: true }));
        this.app.use(body_parser_1.json());
        this.setDefaultHeaders();
        this.mountRoutes();
        this.handleErrors();
    }
    setDefaultHeaders() {
        this.app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        });
    }
    mountRoutes() {
        this.app.get('/test', (req, res) => {
            res.status(200).json({
                message: 'Hello World!'
            });
        });
    }
    handleErrors() {
        this.app.use((req, res) => {
            socket_1.default.io.emit('page', {
                data: req.url
            });
            res.status(404).json({
                message: 'Page not found.',
                data: req.url
            });
        });
        this.app.use((error, req, res, next) => res.status(error.statusCode || 500).json({
            message: error.message || error.name || 'Internal Server Error',
            data: error.data
        }));
    }
}
exports.default = new App().app;
