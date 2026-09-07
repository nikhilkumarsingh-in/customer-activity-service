import { config } from "dotenv-flow";

config({ silent: true });

const SERVER_ENDPOINT = `http://localhost:${process.env.PORT}${process.env.SERVER_BASE_PATH}`;

const CUSTOMER_ROUTE = "/customers";

export const AUTOCANNON_DATA = {
    DEFAULT_DURATION: 10,
    DEFAULT_CONNECTIONS: 10,

    ROUTES: { CUSTOMERS: { CREATE: `${SERVER_ENDPOINT}${CUSTOMER_ROUTE}/` } },
};
