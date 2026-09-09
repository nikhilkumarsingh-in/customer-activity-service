import { startSession, Types, type ClientSession, type QueryFilter } from "mongoose";

import { CustomerModel, type Customer } from "../../models/customer.model.ts";
import { CustomerTimelineModel, type CustomerTimelineMetadata } from "../../models/customer-timeline.model.ts";

import type {
    CreateCustomerSchemaType,
    GetCustomerDetailsSchemaType,
    SearchCustomersQuerySchemaType,
    GetCustomerTimelineQuerySchemaType,
    UpdateCustomerDetailsSchemaType,
    UpdateCustomerStatusSchemaType,
} from "./customer.validation.ts";

import { ApplicationError, ERROR_CODES, STATUS_CODES } from "../../lib/application-errors.lib.ts";
import { CUSTOMER_ACTIVITY_TYPES, type CustomerActivityType } from "../../constants/customer.constant.ts";

type CreateTimelineProps = {
    id: Types.ObjectId;
    session: ClientSession;
    action: CustomerActivityType;
    metadata: CustomerTimelineMetadata;
};
export class CustomerService {
    private async handleCreateTimeline(details: CreateTimelineProps) {
        await CustomerTimelineModel.create(
            [{ customer: details.id, action: details.action, metadata: details.metadata }],
            { session: details.session }
        );
    }
    public async create(details: CreateCustomerSchemaType) {
        const session = await startSession();

        try {
            return await session.withTransaction(async () => {
                const customer = new CustomerModel({
                    fullName: details.fullName,
                    phoneNumber: details.phoneNumber,
                    role: details.role,

                    ...(details.emailAddress && { emailAddress: details.emailAddress }),
                });

                await customer.save({ session });

                await this.handleCreateTimeline({
                    id: customer._id,
                    action: CUSTOMER_ACTIVITY_TYPES.PROFILE_CREATED,

                    metadata: { status: customer.status },

                    session,
                });

                return customer;
            });
        } finally {
            await session.endSession();
        }
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

    public async getTimeline({ limit, currentPage, sort, statuses }: GetCustomerTimelineQuerySchemaType) {
        const queries: QueryFilter<Customer> = {};

        if (statuses) queries.status = { $in: statuses };

        const [timeline, count] = await Promise.all([
            CustomerTimelineModel.find(queries)
                .sort({ [sort.field]: sort.direction })
                .skip((currentPage - 1) * limit)
                .limit(limit + 1)
                .lean(),
            CustomerTimelineModel.countDocuments(queries),
        ]);

        return { timeline, count, totalPages: Math.ceil(count / limit) };
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
        const session = await startSession();

        try {
            await session.withTransaction(async () => {
                const customer = await CustomerModel.findByIdAndUpdate(payload.id, details, {
                    session,
                    returnDocument: "after",
                });

                if (!customer)
                    throw new ApplicationError(
                        "Customer profile was not found with the provided id.",
                        STATUS_CODES.RESOURCE_NOT_FOUND,
                        ERROR_CODES.RESOURCE_NOT_FOUND
                    );

                await this.handleCreateTimeline({
                    id: customer._id,
                    action: CUSTOMER_ACTIVITY_TYPES.UPDATE_PROFILE_DETAILS,

                    metadata: { status: customer.status },

                    session,
                });
            });
        } finally {
            await session.endSession();
        }
    }

    public async updateStatus(payload: GetCustomerDetailsSchemaType, details: UpdateCustomerStatusSchemaType) {
        const session = await startSession();

        try {
            await session.withTransaction(async () => {
                const customer = await this.details(payload);

                if (customer.status === details.status)
                    throw new ApplicationError(
                        "Provided status must be different from the current one.",
                        STATUS_CODES.BAD_REQUEST,
                        ERROR_CODES.BAD_REQUEST
                    );

                const updated = await CustomerModel.findByIdAndUpdate(
                    payload.id,
                    {
                        status: details.status,

                        ...(details.status === "suspended_by_management" && details.reasonForAccountSuspension
                            ? {
                                  $set: { reasonForAccountSuspension: details.reasonForAccountSuspension },
                                  $unset: { deletedOn: "" },
                              }
                            : details.status === "account_was_deleted"
                              ? { $set: { deletedOn: new Date() }, $unset: { reasonForAccountSuspension: "" } }
                              : { $unset: { reasonForAccountSuspension: "", deletedOn: "" } }),
                    },
                    { session, returnDocument: "after" }
                );

                if (!updated)
                    throw new ApplicationError(
                        "Something went wrong while updating the customer status.",
                        STATUS_CODES.INTERNAL_SERVER_ERROR,
                        ERROR_CODES.INTERNAL_SERVER_ERROR
                    );

                await this.handleCreateTimeline({
                    id: updated._id,
                    action: CUSTOMER_ACTIVITY_TYPES.UPDATE_PROFILE_STATUS,

                    metadata: {
                        status: updated.status,
                        reasonForAccountSuspension: updated.reasonForAccountSuspension,
                        deletedOn: updated.deletedOn,
                    },

                    session,
                });
            });
        } finally {
            await session.endSession();
        }
    }

    public async delete(payload: GetCustomerDetailsSchemaType) {
        const customer = await CustomerModel.findByIdAndDelete(payload.id);

        if (!customer)
            throw new ApplicationError(
                "Customer profile was not found with the provided id.",
                STATUS_CODES.RESOURCE_NOT_FOUND,
                ERROR_CODES.RESOURCE_NOT_FOUND
            );

        return;
    }
}
