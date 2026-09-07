const APPLICATION_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED_ACCESS: 401,
    FORBIDDEN: 403,
    RESOURCE_NOT_FOUND: 404,
    DATA_CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
} as const;

type ApplicationStatusCode = (typeof APPLICATION_STATUS_CODES)[keyof typeof APPLICATION_STATUS_CODES];

const APPLICATION_ERROR_CODES = {
    BAD_REQUEST: "BAD_REQUEST",
    PAYLOAD_VALIDATION_FAILED: "PAYLOAD_VALIDATION_FAILED",
    UNAUTHORIZED_ACCESS: "UNAUTHORIZED_ACCESS",
    FORBIDDEN: "FORBIDDEN",
    RESOURCE_NOT_FOUND: "DATA_OR_RESOURCE_NOT_FOUND",
    DATA_CONFLICT: "DATA_CONFLICT",
    TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
} as const;

type ApplicationErrorCode = (typeof APPLICATION_ERROR_CODES)[keyof typeof APPLICATION_ERROR_CODES];

const APPLICATION_RESPONSE_STATUS_CODES = {
    OPERATION_SUCCESSFULL: "operation_successfull",
    REQUEST_FAILED: "request_failed",
} as const;

class ApplicationError extends Error {
    public readonly statusCode: ApplicationStatusCode;
    public readonly error: ApplicationErrorCode;

    constructor(message: string, statusCode: ApplicationStatusCode, errorCode: ApplicationErrorCode) {
        super(message);

        this.name = "ApplicationError";

        this.statusCode = statusCode;
        this.error = errorCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

export { APPLICATION_STATUS_CODES, APPLICATION_ERROR_CODES, APPLICATION_RESPONSE_STATUS_CODES, ApplicationError };
