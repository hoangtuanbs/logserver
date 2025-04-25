import { BaseApiResponse } from './../api/baseInterface';
import { Request, Response, NextFunction } from 'express';

/**
 * Handles controller execution and responds to user (API Express version).
 * @param promise Controller Promise. I.e. ControllerInstance().getUser.
 * @param params A function (req, res, next), all of which are optional
 * that maps our desired controller parameters. I.e. (req) => [
 * req.params.username, ...].
 */
// tslint:disable-next-line:ban-types
// tslint:disable-next-line:max-line-length
export const baseHandler = (promise: (...any) => Promise<BaseApiResponse>, params: (req: Request, res: Response, next: NextFunction) => any) =>
{
    return async (req, res, next) =>
    {
        const boundParams = params ? params(req, res, next) : [];

        try
        {
            const result = await promise(...boundParams);
            if (result.pagination)
            {
                return res.status(result.statusCode)
                    .json(
                    {
                        status: result.status,
                        message: result.message,
                        data: result.data,
                        pagination: result.pagination,
                    });
            }
            return res.status(result.statusCode)
                .json(
                {
                    status: result.status,
                    message: result.message,
                    data: result.data,
                });
        } catch (error)
        {
            next(error);
        }
    };
};