import type { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose";
import { ZodError } from "zod";

import { ERROR_CODES, RESPONSE_STATUS_CODES, STATUS_CODES, ApplicationError } from "../lib/application-errors.lib.ts";

function handleInvalidApiOrNotFoundError(request: Request, response: Response) {
    return response.status(STATUS_CODES.RESOURCE_NOT_FOUND).json({
        message: "Requested API endpoint does not exist at the moment.",

        status: RESPONSE_STATUS_CODES.REQUEST_FAILED,
        error: ERROR_CODES.RESOURCE_NOT_FOUND,
    });
}

function handleApplicationError(error: Error, request: Request, response: Response, next: NextFunction) {
    if (error instanceof SyntaxError)
        return response.status(STATUS_CODES.BAD_REQUEST).json({
            message: "Received invalid or malformed JSON data in the request body.",

            status: RESPONSE_STATUS_CODES.REQUEST_FAILED,
            error: ERROR_CODES.BAD_REQUEST,
        });

    if (error instanceof ZodError)
        return response.status(STATUS_CODES.BAD_REQUEST).json({
            message: error.issues[0]?.message,
            status: RESPONSE_STATUS_CODES.REQUEST_FAILED,
            error: ERROR_CODES.PAYLOAD_VALIDATION_FAILED,
        });

    if (error instanceof MongooseError && "code" in error && error.code === 11000) {
        const field = Object.keys((error as any).keyPattern ?? {})[0];

        const MONGOOSE_DUPLICATE_ERROR_MESSAGES = {
            EMAILADDRESS: "Provided email address already exists in our database.",
            PHONENUMBER: "Provided phone number for the contact details is already exist in our database.",
        } as const;

        const message = field
            ? MONGOOSE_DUPLICATE_ERROR_MESSAGES[field.toUpperCase() as keyof typeof MONGOOSE_DUPLICATE_ERROR_MESSAGES]
            : "Provided resource value already exist in our database.";

        return response.status(STATUS_CODES.DATA_CONFLICT).json({
            message,

            status: RESPONSE_STATUS_CODES.REQUEST_FAILED,
            error: ERROR_CODES.DATA_CONFLICT,
        });
    }

    if (error instanceof ApplicationError)
        return response
            .status(error.statusCode)
            .json({ message: error.message, status: RESPONSE_STATUS_CODES.REQUEST_FAILED, error: error.error });

    return response.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong while processing the request.",

        status: RESPONSE_STATUS_CODES.REQUEST_FAILED,
        error: ERROR_CODES.INTERNAL_SERVER_ERROR,
    });
}

export { handleInvalidApiOrNotFoundError, handleApplicationError };
