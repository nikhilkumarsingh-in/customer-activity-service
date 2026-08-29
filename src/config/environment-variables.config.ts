import { config } from "dotenv-flow";

config({ silent: true });

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
} as const;
