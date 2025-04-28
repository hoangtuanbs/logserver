import { BaseApiResponse } from './baseInterface';
import { HttpStatusCode } from './../enums';

export class BaseController
{
    // tslint:disable-next-line:max-line-length
    public sendResponse(
    {
        data,
        message = 'OK',
        statusCode = HttpStatusCode.OK,
        pagination = null
    }: BaseApiResponse)
    {
        return { data, message, statusCode, pagination };
    }
}