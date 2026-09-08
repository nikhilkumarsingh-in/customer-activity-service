import { config } from "dotenv-flow";

config({ silent: true });

const SERVER_ENDPOINT = `http://localhost:${process.env.PORT}${process.env.SERVER_BASE_PATH}`;

const CUSTOMER_ROUTE = "/customers";

export const AUTOCANNON_DATA = {
    DEFAULT_DURATION: 10,
    DEFAULT_CONNECTIONS: 10,

    ROUTES: {
        CUSTOMERS: {
            CREATE: `${SERVER_ENDPOINT}${CUSTOMER_ROUTE}/`,
            SEARCH: `${SERVER_ENDPOINT}${CUSTOMER_ROUTE}/?limit=10&currentPage=1&sort=phoneNumber:asc&keyword=&statuses=account_is_active,suspended_by_management,account_was_deleted&roles=enterprise,individual`,
            GET_DETAILS: `${SERVER_ENDPOINT}${CUSTOMER_ROUTE}/6a9fc4bc580c98e00083d645`,
            UPDATE_DETAILS: `${SERVER_ENDPOINT}${CUSTOMER_ROUTE}/6a9fc4bc580c98e00083d645`,
        },
    },
};
