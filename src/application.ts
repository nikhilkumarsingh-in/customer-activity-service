import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import { EnvironmentVariables } from "./config/environment-variables.config.ts";
import { CorsConfiguration } from "./config/cors.config.ts";
import { handleApplicationError, handleInvalidApiOrNotFoundError } from "./middleware/error-handlers.middleware.ts";

export const application = express();

application.use(express.json({ limit: "1mb" }));
application.use(express.urlencoded({ extended: true, limit: "1mb" }));
application.use(cors(CorsConfiguration));
application.use(helmet());
application.use(compression({ level: 6, threshold: 512 }));
application.use(morgan(EnvironmentVariables.CURRENT_ENVIRONMENT === "production" ? "combined" : "dev"));

application.use(handleInvalidApiOrNotFoundError);
application.use(handleApplicationError);
