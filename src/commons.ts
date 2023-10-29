import { PrismaClient } from "@prisma/client/edge";
import dotenv from "dotenv";
dotenv.config();

export const port = process.env.PORT || 8080;
export const public_url = process.env.PUBLIC_URL || "http://localhost";

export const prisma = new PrismaClient();
export { User, Lawyer, Query } from "@prisma/client/edge";

export enum QueryStatus {
    NotAccepted = 0,
    Open = 1,

    Absolved = 98,
    Closed = 100,

    Orphaned = 999,
}

export enum ResponseCodes {
    OK = 200,
    CREATED,
    NOCONTENT = 204,

    BADREQUEST = 400,
    UNAUTHORISED = 401,
    FORBIDDEN = 403,
    NOTFOUND = 404,
    CONFLICT = 409,

    INTERNALSERVERERROR = 500,
}

export interface Result<T> {
    responseCode: ResponseCodes;
    data: T | null;
}
