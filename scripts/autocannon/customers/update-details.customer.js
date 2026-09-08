import autocannon from "autocannon";

import {
    handleGenerateEmailAddressFromFullName,
    handleGenerateUniqueFullName,
    handleGenerateUniquePhoneNumber,
} from "./lib.customer.js";
import { AUTOCANNON_DATA } from "../data.autocannon.js";

autocannon.track(
    autocannon(
        {
            url: AUTOCANNON_DATA.ROUTES.CUSTOMERS.UPDATE_DETAILS,

            duration: AUTOCANNON_DATA.DEFAULT_DURATION,
            connections: AUTOCANNON_DATA.DEFAULT_CONNECTIONS,

            method: "PATCH",

            headers: { "content-type": "application/json" },

            setupClient(client) {
                client.on("body", () => {
                    const fullName = handleGenerateUniqueFullName();

                    client.setBody(
                        JSON.stringify({
                            fullName,
                            emailAddress: handleGenerateEmailAddressFromFullName(fullName),
                            phoneNumber: handleGenerateUniquePhoneNumber(),
                        })
                    );
                });
            },
        },
        (error) => {
            if (error) {
                console.log("Something went wrong running script for update-customer-details:", error);
                process.exit(1);
            }
        }
    )
);
