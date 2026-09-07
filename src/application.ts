import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import { EnvironmentVariables } from "./config/environment.config.ts";
import { CorsConfiguration } from "./config/cors.config.ts";
import { handleApplicationError, handleInvalidApiOrNotFoundError } from "./middleware/error-handlers.middleware.ts";
import { handleCreateGlobalRateLimitMiddleware } from "./middleware/rate-limit.middleware.ts";

import { ModuleRoutes } from "./modules/routes.module.ts";

export const application = express();

const router = new ModuleRoutes();

application.use(helmet());
application.use(cors(CorsConfiguration));
application.use(morgan(EnvironmentVariables.CURRENT_ENVIRONMENT === "production" ? "combined" : "dev"));
application.use(handleCreateGlobalRateLimitMiddleware());
application.use(express.json({ limit: "1mb" }));
application.use(express.urlencoded({ extended: true, limit: "1mb" }));
application.use(compression({ level: 9, threshold: 0 }));

application.use(EnvironmentVariables.SERVER_BASE_PATH, router.router);

application.use(handleInvalidApiOrNotFoundError);
application.use(handleApplicationError);
