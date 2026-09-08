import { model, Schema } from "mongoose";

import {
    CUSTOMER_ROLES,
    CUSTOMER_STATUSES,
    type CustomerRole,
    type CustomerStatus,
} from "../constants/customer.constant.ts";

export interface Customer {
    fullName: string;
    emailAddress?: string;
    phoneNumber: string;
    status: CustomerStatus;
    reasonForAccountSuspension?: string;
    deletedOn: Date;
    role: CustomerRole;

    createdAt: Date;
    updatedAt: Date;
}

const CustomerSchema = new Schema<Customer>(
    {
        fullName: { type: String, required: true, trim: true },
        emailAddress: { type: String, required: false, trim: true, lowercase: true },
        phoneNumber: { type: String, required: true, trim: true, maxLength: 13 },
        status: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            default: CUSTOMER_STATUSES.ACCOUNT_IS_ACTIVE,
        },
        reasonForAccountSuspension: { type: String, required: false, trim: true },
        deletedOn: { type: Date, required: false },
        role: { type: String, required: true, trim: true, lowercase: true, default: CUSTOMER_ROLES.INDIVIDUAL },
    },
    { collection: "customers", timestamps: true, versionKey: false }
);

CustomerSchema.index({ fullName: 1 });
CustomerSchema.index({ fullName: 1, status: 1 });
CustomerSchema.index({ fullName: 1, role: 1 });
CustomerSchema.index({ fullName: 1, status: 1, role: 1 });

CustomerSchema.index(
    { emailAddress: 1 },
    {
        unique: true,
        sparse: true,
        partialFilterExpression: { emailAddress: { $exists: true, $type: "string" } },
    }
);
CustomerSchema.index({ phoneNumber: 1 }, { unique: true });

export const CustomerModel = model<Customer>("customer", CustomerSchema);
