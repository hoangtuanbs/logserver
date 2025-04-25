//
import { Router } from "express";

import { baseHandler } from '../baseHandler';
import { LogController } from './Log.controller';

const router = Router();
const call = baseHandler;
const LogService = new LogController();

router.get('/', call(LogService.getAllLogs, (req, _res, _next) => [req.params.id]));
router.post('/', call(LogService.insertLog, (req, _res, _next) => [req.body.json]));

router.get('/:id', call(LogService.getLogById, (req, _res, _next) => [req.params.id]));

export const logRouter = router;