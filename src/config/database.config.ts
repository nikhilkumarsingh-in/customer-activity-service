import mongoose from "mongoose";

import { EnvironmentVariables } from "./environment-variables.config.ts";

export async function handleEstablishDatabaseConnection() {
    try {
        const databaseConnectionString = EnvironmentVariables.DATABASE.CONNECTION_STRING.replace(
            "<db_password>",
            EnvironmentVariables.DATABASE.PASSWORD
        );

        const response = await mongoose.connect(databaseConnectionString);
        console.log("Database connected successfully with host:", response.connection.host);
    } catch (error) {
        const errorMessage = (error as Error).message;
        console.error("Database connection failed due to", errorMessage);

        process.exit(1);
    }
}
