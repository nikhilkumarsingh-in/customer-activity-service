const STATUS_CODES = {
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

type StatusCode = (typeof STATUS_CODES)[keyof typeof STATUS_CODES];

const ERROR_CODES = {
    BAD_REQUEST: "BAD_REQUEST",
    PAYLOAD_VALIDATION_FAILED: "PAYLOAD_VALIDATION_FAILED",
    UNAUTHORIZED_ACCESS: "UNAUTHORIZED_ACCESS",
    FORBIDDEN: "FORBIDDEN",
    RESOURCE_NOT_FOUND: "DATA_OR_RESOURCE_NOT_FOUND",
    DATA_CONFLICT: "DATA_CONFLICT",
    TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
} as const;

type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

const RESPONSE_STATUS_CODES = {
    OPERATION_SUCCESSFULL: "operation_successfull",
    REQUEST_FAILED: "request_failed",
} as const;

class ApplicationError extends Error {
    public readonly statusCode: StatusCode;
    public readonly error: ErrorCode;

    constructor(message: string, statusCode: StatusCode, errorCode: ErrorCode) {
        super(message);

        this.name = "ApplicationError";

        this.statusCode = statusCode;
        this.error = errorCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

export { STATUS_CODES, ERROR_CODES, RESPONSE_STATUS_CODES, ApplicationError };
