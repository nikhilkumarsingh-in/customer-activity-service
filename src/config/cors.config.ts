import type { CorsOptions } from "cors";

import { EnvironmentVariables } from "./environment.config.ts";

export const CorsConfiguration: CorsOptions = {
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    exposedHeaders: ["Content-Type", "Authorization", "Set-Cookie"],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],

    origin(requestOrigin, callback) {
        if (!requestOrigin) return callback(null, true);
        if (requestOrigin === EnvironmentVariables.CLIENT_URL) return callback(null, true);

        return callback(new Error("Request origin is not allowed by CORS policy."));
    },
};
