import { CustomerModel } from "../../models/customer.model.ts";
import type { CreateCustomerSchemaType } from "./customer.validation.ts";

import { ERROR_CODES, STATUS_CODES, ApplicationError } from "../../lib/application-errors.lib.ts";

type SearchProps = { limit: number; page: number; sort: string; keyword?: string; statuses?: string; roles?: string };

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

    public async search({ limit, page, sort, keyword, statuses, roles }: SearchProps) {
        const queries = {} as any;

        if (keyword)
            queries.$or = [
                { fullName: { $regex: keyword, $options: "i" } },
                { emailAddress: { $regex: keyword, $options: "i" } },
                { phoneNumber: { $regex: keyword, $options: "i" } },
            ];

        if (statuses) queries.status = { $in: statuses.split(",") };
        if (roles) queries.role = { $in: roles.split(",") };

        const [customers, count] = await Promise.all([
            CustomerModel.find(queries)
                .sort({ [String(sort.split(":")[0])]: sort.split(":")[1] === "desc" ? -1 : 1 })
                .skip(page * limit - limit)
                .limit(limit)
                .lean()
                .exec(),
            CustomerModel.countDocuments(queries).exec(),
        ]);

        const pages = Math.ceil(count / limit);

        return { customers, pages, count };
    }
}
