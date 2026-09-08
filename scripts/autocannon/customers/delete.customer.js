import autocannon from "autocannon";

import { AUTOCANNON_DATA } from "../data.autocannon.js";

autocannon.track(
    autocannon(
        {
            duration: AUTOCANNON_DATA.DEFAULT_RUN_DURATION,
            connections: AUTOCANNON_DATA.DEFAULT_CONCURRENT_CONNECTIONS,
            url: AUTOCANNON_DATA.ROUTES.CUSTOMERS.DELETE_CUSTOMER_PROFILE.ENDPOINT,
            method: AUTOCANNON_DATA.ROUTES.CUSTOMERS.DELETE_CUSTOMER_PROFILE.METHOD,

            setupClient(client) {
                client.on("headers", () => {
                    client.setHeaders({ "content-type": "application/json" });
                });
            },
        },
        (error) => {
            if (error) {
                console.log("Something went wrong running script for delete-customer:", error);
                process.exit(1);
            }
        }
    )
);
