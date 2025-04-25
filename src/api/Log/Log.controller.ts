
import { BaseController } from '../baseController';
import { AppDataSource } from "../../dataSource/dataSource";
import { Log } from "./Log.model";
import { HttpStatusCode } from '../../enums';
import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

const defaultPageSize = 1000;

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
    private logRepository = AppDataSource.getRepository(Log);

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

            const [logs, total] = await this.logRepository.createQueryBuilder('logs')
                .skip((page - 1) * pageSize)
                .take(pageSize)
                .getManyAndCount();

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
     * @param {any} json
     * @returns {Promise<Response>}
     * @memberof LogController
     */

    public insertLog = async (json: any) =>
    {
        try
        {
            if (!json || typeof json !== "object")
            {
                return this.sendResponse({ message: "Valid JSON object is required", statusCode: HttpStatusCode.BAD_REQUEST });
            }

            const log = new Log();
            log.json = json;

            const savedLog = await this.logRepository.save(log);
            return this.sendResponse(
            {
                data: savedLog,
                statusCode: HttpStatusCode.CREATED
            });
        } catch (error)
        {
            return this.sendResponse({ message: "Failed to insert log", statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR });
        }
    }

    /**
     * Get log by ID
     *
     * @param {number} id
     * @returns {Promise<Response>}
     * @memberof LogController
     */
    public getLogById = async (id: number) =>
    {
        try
        {
            const log = await this.logRepository.findOneBy({ id });
            if (!log)
            {
                return this.sendResponse({ message: "Log not found", statusCode: HttpStatusCode.NOT_FOUND });
            }
            return this.sendResponse({ data: log });
        } catch (error)
        {
            return this.sendResponse({ message: "Failed to fetch log: " + error.message, statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR });
        }
    }

    /**
     * Get logs by date
     *
     * @param {Date} date
     * @returns {Promise<Response>}
     * @memberof LogController
     */
    public getLogsByDate = async (date: Date) =>
    {
        try
        {
            const beginningTime = new Date(date);
            beginningTime.setUTCHours(0, 0, 0, 0);

            const endTime = new Date(date);
            endTime.setUTCHours(23, 59, 59, 999);

            const logs = this.logRepository.createQueryBuilder("log")
                .where("log.inserted_at > :date", { beginningTime })
                .andWhere("log.inserted_at < :endTime", { endTime }).getMany();

            return this.sendResponse({ data: logs });
        } catch (error)
        {
            return this.sendResponse({ message: "Failed to fetch logs: " + error.message, statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR });
        }
    }

    /**
     * Get logs with pagination
     *
     * @param {Request} req
     *     - page - The current page number
     *     - limit - The number of logs per page
     * @returns {Promise<Response>}
     * @memberof LogController
     */
    public getLogsWithPagination = async (req: Request<ParamsDictionary, any, any, ParsedQs>, res: Response, next: NextFunction) =>
    {
        try
        {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || defaultPageSize;

            const [logs, total] = await this.logRepository.findAndCount(
            {
                skip: (page - 1) * limit,
                take: limit,
            });

            return this.sendResponse({ data: logs, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
        } catch (error)
        {
            next(error);
        }
    }
}