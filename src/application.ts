import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import { EnvironmentVariables } from "./config/environment-variables.config.ts";

export const application = express();

application.use(express.json({ limit: "1mb" }));
application.use(express.urlencoded({ extended: true, limit: "1mb" }));
application.use(cors());
application.use(helmet());
application.use(compression({ level: 6, threshold: 512 }));
application.use(morgan(EnvironmentVariables.CURRENT_ENVIRONMENT === "production" ? "combined" : "dev"));
