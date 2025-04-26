// src/index.ts
import express from "express";

import { Log } from "./api/Log/Log.model";
import app from './server';

import { PORT } from './config';

const port = PORT || 3000;
app.set('port', port);
app.listen(app.get('port'), () =>
{
    console.info(`server is listening on ${port}`);
});
