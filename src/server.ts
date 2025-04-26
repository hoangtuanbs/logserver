import express from 'express';
import { logRouter } from './api/Log/';
import { BASE_PATH, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, ENVIRONMENT, USE_COMPRESSION } from './config';
import compression from 'compression';

import 'reflect-metadata';
import { AppDataSource } from './dataSource/dataSource';

class App
{
    public express = express();
    public basePath = BASE_PATH || '';
    public userCompression = USE_COMPRESSION || false;

    constructor()
    {
        this.init();
    }

    public async init()
    {
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));
        if (this.userCompression)
        {
            this.express.use(compression());
        }
        await this.initializeDb();
        this.mountRoutes();
    }

    private mountRoutes()
    {
        this.express.use(`${this.basePath}/api/logs`, logRouter);
    }

    private async initializeDb()
    {
        if (ENVIRONMENT !== 'test')
        {
            try
            {
                await AppDataSource.initialize();

                console.log('Database connection has been established successfully.');
            } catch (err)
            {
                throw new Error(('Unable to connect to the database:' + err));
            }
        }
    }
}

const app = new App().express;
export default app;