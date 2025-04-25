// src/index.ts
import express from "express";
//import { AppDataSource } from "./dataSource/postgresDataSource";
//import logRouter from "./api/Log/Log.router";

import { Log } from "./api/Log/Log.model";
import app from './server';

import { PORT } from './config';

const port = PORT || 3000;
app.set('port', port);
app.listen(app.get('port'), () =>
{
    console.info(`server is listening on ${port}`);
});

/*
AppDataSource.initialize()
    .then(async () =>
    {
        app.listen(PORT, () =>
        {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => console.log("Error during DataSource initialization:", error));*/