import autocannon from "autocannon";

import { handleGetRandomValuesForCustomerStatusChange } from "./lib.customer.js";
import { AUTOCANNON_DATA } from "../data.autocannon.js";

autocannon.track(
    autocannon(
        {
            duration: AUTOCANNON_DATA.DEFAULT_RUN_DURATION,
            connections: AUTOCANNON_DATA.DEFAULT_CONCURRENT_CONNECTIONS,
            url: AUTOCANNON_DATA.ROUTES.CUSTOMERS.UPDATE_CUSTOMER_PROFILE_STATUS.ENDPOINT,
            method: AUTOCANNON_DATA.ROUTES.CUSTOMERS.UPDATE_CUSTOMER_PROFILE_STATUS.METHOD,

            setupClient(client) {
                client.on("headers", () => {
                    client.setHeaders({ "content-type": "application/json" });
                });

                client.on("body", () => {
                    client.setBody(JSON.stringify(handleGetRandomValuesForCustomerStatusChange()));
                });
            },
        },
        (error) => {
            if (error) {
                console.log("Something went wrong running script for update-customer-status:", error);
                process.exit(1);
            }
        }
    )
);
