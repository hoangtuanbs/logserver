import * as dotenv from 'dotenv';

const path = process.env.NODE_ENV == 'test' ? '.env.test' : '.env';
dotenv.config({ path });

export const PORT = process.env.PORT;
export const ENVIRONMENT = process.env.NODE_ENV;
export const APP_URL = process.env.APP_URL;
export const BASE_PATH = process.env.BASE_PATH;
export const DB_NAME = process.env.DB_NAME;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_HOST = process.env.DB_HOST;
export const JWT_SECRET = process.env.JWT_SECRET;
export const USE_COMPRESSION = process.env.USE_COMPRESSION;
