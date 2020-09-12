import express from "express";
import mongoose from "mongoose";
import * as bodyParser from "body-parser";
import { Routes } from "./routes";
import compression from 'compression';
import cors from 'cors';
import { Secrets } from "./secrets";

class CreateServer {
    private app: express.Application;
    private routes = new Routes();
    constructor() {
        this.app = express();
        this.init();
    }

    private async init() {
        await this.initDataBase();
        this.initServer();
    }

    private initServer() {
        this.app.set('secret', Secrets.JWT_SECRET);
        this.app.use(compression())
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.routes.initRoutes(this.app);
        this.validateFirstUse();
    }

    private async initDataBase() {
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        mongoose.set('useUnifiedTopology', true);
        await mongoose.connect('mongodb://localhost:27017/packpack');
    }

    private async validateFirstUse() {
        if (await mongoose.model('Users').countDocuments() === 0) {
            const UserModel = mongoose.model('Users');

            const newUser = new UserModel({
                user: 'admin',
                password: 'admin',
                name: 'admin',
                email: 'admin@admin.com'
            });
            await newUser.save();
        }
    }

    public getApp() {
        return this.app;
    }
}

export default CreateServer;