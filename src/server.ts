import { Server as HttpServer } from "node:http";
import { disconnect } from "mongoose";

import { application } from "./application.ts";
import { EnvironmentVariables } from "./config/environment.config.ts";
import { handleEstablishDatabaseConnection } from "./config/database.config.ts";

const server = new HttpServer(application);

async function handleBootstrapServer() {
    try {
        await handleEstablishDatabaseConnection();

        server.listen(EnvironmentVariables.PORT, () => {
            console.log("Server is listening on port:", EnvironmentVariables.PORT);
            console.log("Current environment for the application is:", EnvironmentVariables.CURRENT_ENVIRONMENT);
        });
    } catch (error) {
        const errorMessage = (error as Error).message;

        console.error("Something went wrong while starting the server:", errorMessage);
        process.exit(1);
    }
}

async function handleShutdownServerGracefully(signal: string) {
    console.log(`Shutting down server gracefully due to ${signal} signal received.`);

    server.close(async () => {
        await disconnect();

        console.log("Database connection closed successfully.");
        console.log("Server shut down successfully.");

        process.exit(0);
    });
}

process.on("SIGTERM", () => handleShutdownServerGracefully("SIGTERM"));
process.on("SIGINT", () => handleShutdownServerGracefully("SIGINT"));

void handleBootstrapServer();
