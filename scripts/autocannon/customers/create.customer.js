import autocannon from "autocannon";

import {
    handleGenerateEmailAddressFromFullName,
    handleGenerateUniqueFullName,
    handleGenerateUniquePhoneNumber,
    handleGetRandomRole,
} from "./lib.customer.js";

import { AUTOCANNON_DATA } from "../data.autocannon.js";

autocannon.track(
    autocannon(
        {
            duration: AUTOCANNON_DATA.DEFAULT_RUN_DURATION,
            connections: AUTOCANNON_DATA.DEFAULT_CONCURRENT_CONNECTIONS,
            url: AUTOCANNON_DATA.ROUTES.CUSTOMERS.CREATE_NEW_CUSTOMER_PROFILE.ENDPOINT,
            method: AUTOCANNON_DATA.ROUTES.CUSTOMERS.CREATE_NEW_CUSTOMER_PROFILE.METHOD,

            setupClient(client) {
                client.on("headers", () => {
                    client.setHeaders({ "content-type": "application/json" });
                });

                client.on("body", () => {
                    const fullName = handleGenerateUniqueFullName();

                    client.setBody(
                        JSON.stringify({
                            fullName,
                            emailAddress: handleGenerateEmailAddressFromFullName(fullName),
                            phoneNumber: handleGenerateUniquePhoneNumber(),
                            role: handleGetRandomRole(),
                        })
                    );
                });
            },
        },
        (error) => {
            if (error) {
                console.log("Something went wrong running script for create-customer:", error);
                process.exit(1);
            }
        }
    )
);
