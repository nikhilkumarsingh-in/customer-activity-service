import { config } from "dotenv-flow";

config({ silent: true });

const SERVER_ENDPOINT = `http://localhost:${process.env.PORT}${process.env.SERVER_BASE_PATH}`;

export const AUTOCANNON_DATA = {
    DEFAULT_RUN_DURATION: 10,
    DEFAULT_CONCURRENT_CONNECTIONS: 10,

    ROUTES: {
        CUSTOMERS: {
            CREATE_NEW_CUSTOMER_PROFILE: { ENDPOINT: `${SERVER_ENDPOINT}/customers/`, METHOD: "POST" },

            SEARCH_CUSTOMER_PROFILES: {
                ENDPOINT: `${SERVER_ENDPOINT}/customers/?limit=10&currentPage=1&sort=phoneNumber:asc&keyword=&statuses=account_is_active,suspended_by_management,account_was_deleted&roles=enterprise,individual`,
                METHOD: "GET",
            },

            GET_CUSTOMER_PROFILE_DETAILS: {
                ENDPOINT: `${SERVER_ENDPOINT}/customers/6a9fc4bc580c98e00083d645`,
                METHOD: "GET",
            },

            UPDATE_CUSTOMER_PROFILE_DETAILS: {
                ENDPOINT: `${SERVER_ENDPOINT}/customers/6a9fc4bc580c98e00083d645`,
                METHOD: "PATCH",
            },

            UPDATE_CUSTOMER_PROFILE_STATUS: {
                ENDPOINT: `${SERVER_ENDPOINT}/customers/6a9fc4bc580c98e00083d645/status`,
                METHOD: "PATCH",
            },

            DELETE_CUSTOMER_PROFILE: {
                ENDPOINT: `${SERVER_ENDPOINT}/customers/6a9fc4bc580c98e00083d645`,
                METHOD: "DELETE",
            },
        },
    },
};
