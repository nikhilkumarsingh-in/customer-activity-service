import type { QueryFilter } from "mongoose";

import { CustomerModel, type Customer } from "../../models/customer.model.ts";

import type {
    CreateCustomerSchemaType,
    GetCustomerDetailsSchemaType,
    SearchCustomersQuerySchemaType,
    UpdateCustomerDetailsSchemaType,
    UpdateCustomerRoleSchemaType,
} from "./customer.validation.ts";
import { ApplicationError, ERROR_CODES, STATUS_CODES } from "../../lib/application-errors.lib.ts";

export class CustomerService {
    public async create(details: CreateCustomerSchemaType) {
        return await CustomerModel.create({
            fullName: details.fullName,
            phoneNumber: details.phoneNumber,
            role: details.role,

            ...(details.emailAddress && { emailAddress: details.emailAddress }),
        });
    }

    public async search({ limit, currentPage, sort, keyword, statuses, roles }: SearchCustomersQuerySchemaType) {
        const queries: QueryFilter<Customer> = {};

        if (keyword && keyword.length > 3)
            queries.$or = [
                { fullName: { $regex: keyword, $options: "i" } },
                { emailAddress: { $regex: keyword, $options: "i" } },
                { phoneNumber: { $regex: keyword, $options: "i" } },
            ];

        if (statuses) queries.status = { $in: statuses };
        if (roles) queries.role = { $in: roles };

        const [customers, count] = await Promise.all([
            CustomerModel.find(queries)
                .sort({ [sort.field]: sort.direction })
                .skip((currentPage - 1) * limit)
                .limit(limit + 1)
                .lean(),
            CustomerModel.countDocuments(queries),
        ]);

        return { customers, count, totalPages: Math.ceil(count / limit) };
    }

    public async details(payload: GetCustomerDetailsSchemaType) {
        const customer = await CustomerModel.findById(payload.id).lean();

        if (!customer)
            throw new ApplicationError(
                "Customer profile was not found with the provided id.",
                STATUS_CODES.RESOURCE_NOT_FOUND,
                ERROR_CODES.RESOURCE_NOT_FOUND
            );

        return customer;
    }

    public async updateDetails(payload: GetCustomerDetailsSchemaType, details: UpdateCustomerDetailsSchemaType) {
        const customer = await CustomerModel.findByIdAndUpdate(payload.id, details);

        if (!customer)
            throw new ApplicationError(
                "Customer profile was not found with the provided id.",
                STATUS_CODES.RESOURCE_NOT_FOUND,
                ERROR_CODES.RESOURCE_NOT_FOUND
            );

        return;
    }

    public async updateRole(payload: GetCustomerDetailsSchemaType, details: UpdateCustomerRoleSchemaType) {
        const customer = await CustomerModel.findByIdAndUpdate(payload.id, details);

        if (!customer)
            throw new ApplicationError(
                "Customer profile was not found with the provided id.",
                STATUS_CODES.RESOURCE_NOT_FOUND,
                ERROR_CODES.RESOURCE_NOT_FOUND
            );

        return;
    }
}
