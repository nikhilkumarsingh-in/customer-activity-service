import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

import { APPLICATION_ERROR_CODES, APPLICATION_STATUS_CODES, ApplicationError } from "../lib/application-errors.lib.ts";

function handleInvalidApiOrNotFoundError(request: Request, response: Response) {
    return response.status(APPLICATION_STATUS_CODES.RESOURCE_NOT_FOUND).json({
        message: "Requested API endpoint does not exist at the moment.",
        code: APPLICATION_ERROR_CODES.RESOURCE_NOT_FOUND,
    });
}

function handleApplicationError(error: Error, request: Request, response: Response, next: NextFunction) {
    if (error instanceof SyntaxError)
        return response.status(APPLICATION_STATUS_CODES.BAD_REQUEST).json({
            message: "Received invalid or malformed JSON data in the request body.",
            code: APPLICATION_ERROR_CODES.BAD_REQUEST,
        });

    if (error instanceof ZodError)
        return response
            .status(APPLICATION_STATUS_CODES.BAD_REQUEST)
            .json({ message: error.issues[0]?.message, code: APPLICATION_ERROR_CODES.PAYLOAD_VALIDATION_FAILED });

    if (error instanceof ApplicationError)
        return response.status(error.status).json({ message: error.message, code: error.code });

    return response.status(APPLICATION_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong while processing the request.",
        code: APPLICATION_ERROR_CODES.INTERNAL_SERVER_ERROR,
    });
}

export { handleInvalidApiOrNotFoundError, handleApplicationError };
