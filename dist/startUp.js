"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
// import * as mongoose from 'mongoose';
const Database_1 = require("./utils/Database");
const NewsController_1 = require("./controller/NewsController");
const auth_1 = require("./auth/auth");
class StartUp {
    constructor() {
        this.authenticationToken();
        this.token = jwt.sign(this.payloader, 'token token token');
        console.log(' data ', this.token);
        this.app = express();
        this._db = new Database_1.default();
        this._db.createConnection();
        this.middler();
        this.routes();
    }
    authenticationToken() {
        this.payloader = {
            iss: 'rcc.net',
            iat: new Date().getSeconds(),
            exp: new Date().setMinutes(60),
            username: 'Rafael Carvalho',
            email: 'rapha.pse@outlook.com'
        };
    }
    enableCors() {
        const options = {
            methods: 'GET, POST, PUT, DELETE',
            origin: '*'
        };
        this.app.use(cors(options));
    }
    middler() {
        this.enableCors();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
    routes() {
        this.app.route('/').get((req, res) => {
            res.send({ versao: '0.0.1' });
        });
        // AUTENTICAÇÃO
        this.app.use(auth_1.default.validate);
        // rotas
        this.app.route('/api/news').get(NewsController_1.default.get);
        this.app.route('/api/news/:id').get(NewsController_1.default.getById);
        this.app.route('/api/news').post(NewsController_1.default.create);
        this.app.route('/api/news/:id').put(NewsController_1.default.update);
        this.app.route('/api/news/:id').delete(NewsController_1.default.delete);
    }
}
exports.default = new StartUp();
