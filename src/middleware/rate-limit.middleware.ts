import rateLimit, { type Options } from "express-rate-limit";

import { STATUS_CODES } from "../lib/application-errors.lib.ts";

const RATE_LIMIT_MESSAGE = "Received too many requests from this IP address within allowed interval.";
const RATE_LIMIT_WINDOW_MILLISECONDS = 10 * 60 * 1000;

const DEFAULT_RATE_LIMIT_OPTIONS: Partial<Options> = {
    legacyHeaders: false,
    message: RATE_LIMIT_MESSAGE,
    standardHeaders: true,
    statusCode: STATUS_CODES.TOO_MANY_REQUESTS,
    windowMs: RATE_LIMIT_WINDOW_MILLISECONDS,
};

function handleCreateGlobalRateLimitMiddleware() {
    return rateLimit({ ...DEFAULT_RATE_LIMIT_OPTIONS, limit: 100 });
}

function handleCreateCustomRateLimitMiddlewareForRoute(limit: number) {
    return rateLimit({ ...DEFAULT_RATE_LIMIT_OPTIONS, limit });
}

export { handleCreateGlobalRateLimitMiddleware, handleCreateCustomRateLimitMiddlewareForRoute };
