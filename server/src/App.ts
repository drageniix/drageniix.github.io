import express = require('express');
import { urlencoded, json } from 'body-parser';
import { NextFunction } from 'connect';
import io from './middleware/socket';

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.app.use(urlencoded({ extended: true }));
        this.app.use(json());
        this.setDefaultHeaders();
        this.mountRoutes();
        this.handleErrors();
    }

    setDefaultHeaders() {
        this.app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader(
                'Access-Control-Allow-Methods',
                'GET, POST, PUT, PATCH, DELETE'
            );
            res.setHeader(
                'Access-Control-Allow-Headers',
                'Content-Type, Authorization'
            );
            next();
        });
    }

    mountRoutes() {
        this.app.get('/test', (req, res, next) => {
            io.getIO().emit('test', {
                action: 'test'
            });
            res.status(200).json({
                message: 'Hello World!'
            });
        });
    }

    handleErrors() {
        this.app.use((req, res, next) =>
            res.status(404).json({
                message: 'Page not found.',
                data: req.url
            })
        );

        this.app.use(
            (
                error: {
                    statusCode?: number;
                    message?: string;
                    name?: string;
                    data?: any;
                },
                req: express.Request,
                res: express.Response,
                next: NextFunction
            ) =>
                res.status(error.statusCode || 500).json({
                    message:
                        error.message || error.name || 'Internal Server Error',
                    data: error.data
                })
        );
    }
}

export default new App().app;
