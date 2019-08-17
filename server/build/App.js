"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var body_parser_1 = require("body-parser");
var App = /** @class */ (function () {
    function App() {
        this.app = express();
        this.app.use(body_parser_1.urlencoded({ extended: true }));
        this.app.use(body_parser_1.json());
        this.setDefaultHeaders();
        this.mountRoutes();
        this.handleErrors();
    }
    App.prototype.setDefaultHeaders = function () {
        this.app.use(function (req, res, next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
            next();
        });
    };
    App.prototype.mountRoutes = function () {
        this.app.get("/test", function (req, res, next) {
            return res.status(200).json({
                message: "Hello World!"
            });
        });
    };
    App.prototype.handleErrors = function () {
        this.app.use(function (req, res, next) {
            return res.status(404).json({
                message: "Page not found.",
                data: req.url
            });
        });
        this.app.use(function (error, req, res, next) {
            return res.status(error.statusCode || 500).json({
                message: error.message || "Internal Server Error",
                data: error.data
            });
        });
    };
    return App;
}());
exports.default = new App().app;
