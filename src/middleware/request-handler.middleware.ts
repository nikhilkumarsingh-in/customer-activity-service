import type { RequestHandler } from "express";

export function handleAsynchronousRequest(handler: RequestHandler): RequestHandler {
    return async function (request, response, next) {
        try {
            await handler(request, response, next);
        } catch (error) {
            return next(error);
        }
    };
}
