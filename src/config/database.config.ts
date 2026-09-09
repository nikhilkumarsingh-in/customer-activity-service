import mongoose from "mongoose";

import { EnvironmentVariables } from "./environment.config.ts";

export async function handleEstablishDatabaseConnection() {
    try {
        const databaseConnectionString = EnvironmentVariables.DATABASE.CONNECTION_STRING.replace(
            "<db_password>",
            EnvironmentVariables.DATABASE.PASSWORD
        );

        const response = await mongoose.connect(databaseConnectionString);
        console.log("Database connected successfully with host:", response.connection.host);
    } catch (error) {
        throw error;
    }
}
