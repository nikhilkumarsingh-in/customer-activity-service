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
            url: AUTOCANNON_DATA.ROUTES.CUSTOMERS.CREATE,

            duration: AUTOCANNON_DATA.DEFAULT_DURATION,
            connections: AUTOCANNON_DATA.DEFAULT_CONNECTIONS,

            method: "POST",

            headers: { "content-type": "application/json" },

            setupClient(client) {
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
