import autocannon from "autocannon";

import { AUTOCANNON_DATA } from "../data.autocannon.js";

autocannon.track(
    autocannon(
        {
            url: AUTOCANNON_DATA.ROUTES.CUSTOMERS.DELETE.ENDPOINT,
            duration: AUTOCANNON_DATA.DEFAULT_DURATION,
            connections: AUTOCANNON_DATA.DEFAULT_CONNECTIONS,
            method: AUTOCANNON_DATA.ROUTES.CUSTOMERS.DELETE.METHOD,

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
