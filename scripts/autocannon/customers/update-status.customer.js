import autocannon from "autocannon";

import { handleGetRandomValuesForCustomerStatusChange } from "./lib.customer.js";
import { AUTOCANNON_DATA } from "../data.autocannon.js";

autocannon.track(
    autocannon(
        {
            url: AUTOCANNON_DATA.ROUTES.CUSTOMERS.UPDATE_ROLE.ENDPOINT,
            duration: AUTOCANNON_DATA.DEFAULT_DURATION,
            connections: AUTOCANNON_DATA.DEFAULT_CONNECTIONS,
            method: AUTOCANNON_DATA.ROUTES.CUSTOMERS.UPDATE_ROLE.METHOD,

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
                console.log("Something went wrong running script for update-customer-role:", error);
                process.exit(1);
            }
        }
    )
);
