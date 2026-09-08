import { config } from "dotenv-flow";

config({ silent: true });

const SERVER_ENDPOINT = `http://localhost:${process.env.PORT}${process.env.SERVER_BASE_PATH}`;

const CUSTOMER_ROUTE = "/customers";

export const AUTOCANNON_DATA = {
    DEFAULT_DURATION: 10,
    DEFAULT_CONNECTIONS: 10,

    ROUTES: {
        CUSTOMERS: {
            CREATE: { ENDPOINT: `${SERVER_ENDPOINT}${CUSTOMER_ROUTE}/`, METHOD: "POST" },

            SEARCH: {
                ENDPOINT: `${SERVER_ENDPOINT}${CUSTOMER_ROUTE}/?limit=10&currentPage=1&sort=phoneNumber:asc&keyword=&statuses=account_is_active,suspended_by_management,account_was_deleted&roles=enterprise,individual`,
                METHOD: "GET",
            },

            GET_DETAILS: { ENDPOINT: `${SERVER_ENDPOINT}${CUSTOMER_ROUTE}/6a9fc4bc580c98e00083d645`, METHOD: "GET" },

            UPDATE_DETAILS: {
                ENDPOINT: `${SERVER_ENDPOINT}${CUSTOMER_ROUTE}/6a9fc4bc580c98e00083d645`,
                METHOD: "PATCH",
            },

            UPDATE_STATUS: {
                ENDPOINT: `${SERVER_ENDPOINT}${CUSTOMER_ROUTE}/6a9fc4bc580c98e00083d645/status`,
                METHOD: "PATCH",
            },

            DELETE: {
                ENDPOINT: `${SERVER_ENDPOINT}${CUSTOMER_ROUTE}/6a9fc4bc580c98e00083d645`,
                METHOD: "DELETE",
            },
        },
    },
};
