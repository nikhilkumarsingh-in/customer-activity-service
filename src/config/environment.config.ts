await import("dotenv").then((dotenv) => dotenv.config({ quiet: true }));

function handleGetEnvironmentVariableByName(variableName: string) {
    const variableValue = process.env[variableName];

    if (!variableValue) {
        console.error("Environment variable is not defined for name:", variableName);
        throw new Error("Missing required environment variables.");
    }

    return variableValue;
}

export const EnvironmentVariables = {
    CURRENT_ENVIRONMENT: handleGetEnvironmentVariableByName("NODE_ENV"),
    PORT: Number(handleGetEnvironmentVariableByName("PORT")),
    SERVER_BASE_PATH: handleGetEnvironmentVariableByName("SERVER_BASE_PATH"),

    CLIENT_URL: handleGetEnvironmentVariableByName("CLIENT_URL"),

    DATABASE: {
        CONNECTION_STRING: handleGetEnvironmentVariableByName("DATABASE_CONNECTION_STRING"),
        PASSWORD: handleGetEnvironmentVariableByName("DATABASE_PASSWORD"),
    },
} as const;
