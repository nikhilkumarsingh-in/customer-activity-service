import { model, Schema, Types } from "mongoose";

import {
    CUSTOMER_ACTIVITY_TYPES,
    CUSTOMER_STATUSES,
    type CustomerActivityType,
    type CustomerStatus,
} from "../constants/customer.constant.ts";

export interface CustomerTimelineMetadata {
    status: CustomerStatus;
    reasonForAccountSuspension?: string;
    deletedOn?: Date;
}

export interface CustomerTimeline {
    customer: Types.ObjectId;

    action: CustomerActivityType;
    metadata: CustomerTimelineMetadata;

    createdAt: Date;
    updatedAt: Date;
}

const CustomerTimelineMetadataSchema = new Schema<CustomerTimelineMetadata>(
    {
        status: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            default: CUSTOMER_STATUSES.ACCOUNT_IS_ACTIVE,
        },
        reasonForAccountSuspension: { type: String, required: false, trim: true },
        deletedOn: { type: Date, required: false },
    },
    { _id: false, timestamps: false, versionKey: false }
);

const CustomerTimelineSchema = new Schema<CustomerTimeline>(
    {
        customer: { type: Schema.Types.ObjectId, required: true, ref: "customer" },
        action: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            default: CUSTOMER_ACTIVITY_TYPES.PROFILE_CREATED,
        },
        metadata: { type: CustomerTimelineMetadataSchema, required: true },
    },
    { collection: "customer_timelines", timestamps: true, versionKey: false }
);

CustomerTimelineSchema.index({ action: 1 });

export const CustomerTimelineModel = model<CustomerTimeline>("customer_timeline", CustomerTimelineSchema);
