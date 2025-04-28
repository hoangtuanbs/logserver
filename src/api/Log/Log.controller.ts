
import { BaseController } from '../baseController';
import { AppDataSource } from "../../dataSource/dataSource";
import { Log } from "./Log.model";
import { HttpStatusCode } from '../../enums';
import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { LogService } from './Log.service';


const defaultPageSize = 10;

/**
 * Log controller
 *
 * @export
 * @class LogController
 */
export class LogController extends BaseController
{
    /**
     * Creates an instance of LogController.
     * @memberof LogController
     */
    constructor()
    {
        super();
        this.logService = new LogService();
    }

    private logService;

    /**
     *
     * @param req
     * @param res
     * @param next
     * @returns
     */
    public getAllLogs = async (req: Request, res: Response, next: NextFunction) =>
    {
        try
        {
            let pageStr = undefined;
            let usePaging = false;
            let page = 1;
            let pageSize = defaultPageSize;

            if (req && req.query && req.query.page)
            {
                pageStr = req.query.page as string;
            }

            if (pageStr !== undefined && pageStr !== null)
            {
                usePaging = true;
                page = parseInt(req.query.page as string || '1', 10);
                pageSize = parseInt(req.query.pageSize as string || defaultPageSize.toString(), 10);
            }

            if (page < 1 || pageSize < defaultPageSize)
            {
                return this.sendResponse(
                {
                    message: "Invalid page or pageSize",
                    statusCode: HttpStatusCode.BAD_REQUEST
                });
            }

            const [logs, total] = await this.logService.getLogs(page, pageSize);

            // Response with pagination if needed (usePaging is true
            // or total number of logs is greater than pageSize)
            if (usePaging || total > pageSize)
            {
                return this.sendResponse(
                {
                    data: logs,
                    pagination:
                    {
                        total,
                        page: 1,
                        limit: pageSize,
                        totalPages: Math.ceil(total / pageSize)
                    }
                });
            }
            return this.sendResponse({ data: logs });
        } catch (error)
        {
            return this.sendResponse(
            {
                message: "Failed to fetch logs: " + error.message,
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
            });
        }
    }

    /**
     * Insert log
     *
     * @param {Log} json: The JSON object to be inserted as a log entry.
     * - json: (required) The message to be logged.
     * - inserted_at: (optional) The timestamp of when the log was created.
     * @memberof LogController
     */
    public insertLog = async (json: any, inserted_at: any) =>
    {
        try
        {
            if (!json || typeof json !== "object")
            {
                return this.sendResponse(
                    {
                        message: "Valid JSON object is required",
                        statusCode: HttpStatusCode.BAD_REQUEST
                    });
            }

            const log = new Log();
            log.json = json;

            if (inserted_at)
            {
                const date = new Date(inserted_at);
                if (isNaN(date.getTime()))
                {
                    return this.sendResponse(
                        {
                            message: "Invalid date format",
                            statusCode: HttpStatusCode.BAD_REQUEST
                        });
                }
                log.inserted_at = date;
            }

            const savedLog = await this.logService.save(log);
            return this.sendResponse(
            {
                data: savedLog,
                statusCode: HttpStatusCode.CREATED
            });
        } catch (error)
        {
            return this.sendResponse(
                {
                    message: "Failed to insert log",
                    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
                });
        }
    }

    /**
     * Get logs by id
     * @param {string} id: The ID of the log entry to be fetched.
     */
    public getLogById = async (req: Request<ParamsDictionary, any, any, ParsedQs>, res: Response, next: NextFunction) =>
    {
        try
        {
            if (req.params === undefined || req.params.id === undefined)
            {
                return this.sendResponse(
                {
                    message: "Log ID is required",
                    statusCode: HttpStatusCode.BAD_REQUEST
                });
            }

            const id = req.params.id;
            const log = await this.logService.getById(id);
            if (!log)
            {
                return this.sendResponse(
                {
                    message: "Log not found",
                    statusCode: HttpStatusCode.NOT_FOUND
                });
            }
            return this.sendResponse({ data: log });
        } catch (error)
        {
            return this.sendResponse(
            {
                message: "Failed to fetch log: " + error.message,
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
            });
        }
    }
}