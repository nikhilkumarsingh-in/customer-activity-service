import { CustomerModel } from "../../models/customer.model.ts";
import type { CreateCustomerSchemaType } from "./customer.validation.ts";

import { ERROR_CODES, STATUS_CODES, ApplicationError } from "../../lib/application-errors.lib.ts";

export class CustomerService {
    public async create(details: CreateCustomerSchemaType) {
        if (details.emailAddress && (await CustomerModel.exists({ emailAddress: details.emailAddress })))
            throw new ApplicationError(
                "Provided email address already exist in our database.",

                STATUS_CODES.DATA_CONFLICT,
                ERROR_CODES.DATA_CONFLICT
            );

        if (await CustomerModel.exists({ phoneNumber: details.phoneNumber }))
            throw new ApplicationError(
                "Provided phone number for the contact details is already exist in our database.",

                STATUS_CODES.DATA_CONFLICT,
                ERROR_CODES.DATA_CONFLICT
            );

        const customer = await CustomerModel.create({
            fullName: details.fullName,
            phoneNumber: details.phoneNumber,
            role: details.role,

            ...(details.emailAddress && { emailAddress: details.emailAddress }),
        });

        return customer;
    }
}
