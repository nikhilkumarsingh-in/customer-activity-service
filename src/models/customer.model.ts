import { model, Schema } from "mongoose";

import {
    CUSTOMER_ROLES,
    CUSTOMER_STATUSES,
    type CustomerRole,
    type CustomerStatus,
} from "../constants/customer.constant.ts";

interface Customer {
    fullName: string;
    emailAddress?: string;
    countryCode: string;
    phoneNumberWithoutCountryCode: string;
    status: CustomerStatus;
    reasonForAccountSuspension?: string;
    role: CustomerRole;

    createdAt: string;
    updatedAt: string;
}

const CustomerSchema = new Schema<Customer>(
    {
        fullName: { type: String, required: true, trim: true },
        emailAddress: { type: String, required: false, trim: true, lowercase: true, unique: true, sparse: true },
        countryCode: { type: String, required: true, trim: true, default: "+91" },
        phoneNumberWithoutCountryCode: { type: String, required: true, trim: true, unique: true, maxLength: 16 },
        status: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            default: CUSTOMER_STATUSES.ACTIVE_IS_ACTIVE,
        },
        reasonForAccountSuspension: { type: String, required: false, trim: true },
        role: { type: String, required: true, trim: true, lowercase: true, default: CUSTOMER_ROLES.INDIVIDUAL },
    },
    { collection: "customers", timestamps: true, versionKey: false }
);

export const CustomerModel = model<Customer>("customer", CustomerSchema);
