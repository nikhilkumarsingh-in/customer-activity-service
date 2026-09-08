import autocannon from "autocannon";

import { AUTOCANNON_DATA } from "../data.autocannon.js";

autocannon.track(
    autocannon(
        {
            url: AUTOCANNON_DATA.ROUTES.CUSTOMERS.GET_DETAILS,

            duration: AUTOCANNON_DATA.DEFAULT_DURATION,
            connections: AUTOCANNON_DATA.DEFAULT_CONNECTIONS,

            method: "GET",

            headers: { "content-type": "application/json" },
        },
        (error) => {
            if (error) {
                console.log("Something went wrong running script for get-customer-details:", error);
                process.exit(1);
            }
        }
    )
);
