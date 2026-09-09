import autocannon from "autocannon";

import { AUTOCANNON_DATA } from "../data.autocannon.js";

autocannon.track(
    autocannon(
        {
            duration: AUTOCANNON_DATA.DEFAULT_RUN_DURATION,
            connections: AUTOCANNON_DATA.DEFAULT_CONCURRENT_CONNECTIONS,
            url: AUTOCANNON_DATA.ROUTES.CUSTOMERS.GET_CUSTOMER_TIMELINE.ENDPOINT,
            method: AUTOCANNON_DATA.ROUTES.CUSTOMERS.GET_CUSTOMER_TIMELINE.METHOD,

            setupClient(client) {
                client.on("headers", () => {
                    client.setHeaders({ "content-type": "application/json" });
                });
            },
        },
        (error) => {
            if (error) {
                console.log("Something went wrong running script for get-customer-timeline:", error);
                process.exit(1);
            }
        }
    )
);
