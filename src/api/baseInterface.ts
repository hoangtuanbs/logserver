import { HttpStatusCode } from './../enums';

export interface BaseApiResponse
{
    data?: any;

    message?: string;
    statusCode?: HttpStatusCode;
    status?: boolean;
    pagination?:
    {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}