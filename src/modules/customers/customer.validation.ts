import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import { CUSTOMER_ROLES, CUSTOMER_STATUSES } from "../../constants/customer.constant.ts";

const SORTABLE_FIELDS = [
    "fullName",
    "emailAddress",
    "phoneNumber",
    "createdAt",
    "updatedAt",
    "status",
    "role",
] as const;

const SortFieldRegex = new RegExp(`^(${SORTABLE_FIELDS.join("|")}):(asc|desc)$`);

const FullNameSchema = z
    .string("Full name is required for  identification.")
    .transform((value) => value.trim().replace(/[^a-zA-Z\s]/g, ""))
    .pipe(z.string().min(3, "Customer full name must of at least 3 characters long."))
    .pipe(z.string().max(128, "Provided full name exceeds the maximum allowed limit of 128 characters."));

const EmailAddressSchema = z
    .email("Provided email address is in invalid format.")
    .transform((value) => value.trim().toLowerCase().replace(/\s+/g, ""))
    .pipe(z.string().max(256, "Provided email address exceeds the maximum allowed limit of 256 characters."))
    .optional();

const PhoneNumberSchema = z.string("Phone number is required for saving contact details.").transform((value, ctx) => {
    const parsed = parsePhoneNumberFromString(value.trim(), "IN");

    if (!parsed?.isValid()) {
        ctx.addIssue({ code: "custom", message: "Provided phone number for the contact details is invalid." });
        return z.NEVER;
    }

    return parsed.number;
});

const CreateCustomerSchema = z.object(
    {
        fullName: FullNameSchema,
        emailAddress: EmailAddressSchema,
        phoneNumber: PhoneNumberSchema,
        role: z.enum(CUSTOMER_ROLES, "Provided role cannot be used to create a new entry."),
    },
    { error: "Please fill out all the required fields to create new customer profile." }
);

type CreateCustomerSchemaType = z.infer<typeof CreateCustomerSchema>;

const SearchCustomersQuerySchema = z.object({
    limit: z.coerce.number("Page limit variable must be a valid number value.").int().min(1).max(100).default(10),
    currentPage: z.coerce.number("Current page variable must be a valid number value").int().min(1).default(1),
    sort: z
        .string("Sort variable must be a valid string value.")
        .regex(SortFieldRegex, "Sort must contain a valid field and direction.")
        .default("fullName:asc")
        .transform((value) => {
            const [field, direction] = value.trim().split(":") as [(typeof SORTABLE_FIELDS)[number], "asc" | "desc"];

            return { field, direction };
        }),

    keyword: z
        .string("Keyword variable must be a valid string value.")
        .transform((value) => value.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .optional(),

    statuses: z
        .string("Statuses variable must be a valid string value.")
        .transform((value) => value?.split(",").map((item) => item.trim()))
        .pipe(z.array(z.enum(CUSTOMER_STATUSES, "Received invalid value for customer statuses.")))
        .optional(),

    roles: z
        .string("Roles variable must be a valid string value.")
        .transform((value) => value?.split(",").map((item) => item.trim()))
        .pipe(z.array(z.enum(CUSTOMER_ROLES, "Received invalid value for customer roles.")))
        .optional(),
});

type SearchCustomersQuerySchemaType = z.infer<typeof SearchCustomersQuerySchema>;

const GetCustomerDetailsSchema = z.object({ id: z.string("Customer id is required for fetching details.").trim() });

type GetCustomerDetailsSchemaType = z.infer<typeof GetCustomerDetailsSchema>;

const UpdateCustomerDetailsSchema = z.object(
    { fullName: FullNameSchema, emailAddress: EmailAddressSchema, phoneNumber: PhoneNumberSchema },
    { error: "Please fill out all the required fields to update customer profile." }
);

type UpdateCustomerDetailsSchemaType = z.infer<typeof UpdateCustomerDetailsSchema>;

const UpdateCustomerRoleSchema = z.object(
    { role: z.enum(CUSTOMER_ROLES, "Provided role cannot be used to update customer details.") },
    { error: "Please fill out the required field to update customer role." }
);

type UpdateCustomerRoleSchemaType = z.infer<typeof UpdateCustomerRoleSchema>;

const UpdateCustomerStatusSchema = z
    .object(
        {
            status: z.enum(CUSTOMER_STATUSES, "Provided status cannot be used to update customer details."),
            reasonForAccountSuspension: z
                .string("Reason for account suspension is required to suspend the profile")
                .optional(),
        },
        { error: "Please fill out the required fields to update customer details." }
    )
    .superRefine((values, ctx) => {
        if (values.status === "suspended_by_management") {
            if (!values.reasonForAccountSuspension)
                ctx.addIssue("Reason for account supension is required to suspend the profile");

            if (values.reasonForAccountSuspension && values.reasonForAccountSuspension.trim().length < 12)
                ctx.addIssue("Reason for account suspension must be a valid string and at least 12 characters long.");

            if (values.reasonForAccountSuspension && values.reasonForAccountSuspension.trim().length > 256)
                ctx.addIssue("Reason for account suspension exceeds the maximum allowed limit of 256 characters.");
        }
    });

type UpdateCustomerStatusSchemaType = z.infer<typeof UpdateCustomerStatusSchema>;

export {
    CreateCustomerSchema,
    SearchCustomersQuerySchema,
    GetCustomerDetailsSchema,
    UpdateCustomerDetailsSchema,
    UpdateCustomerRoleSchema,
    UpdateCustomerStatusSchema,
};

export type {
    CreateCustomerSchemaType,
    SearchCustomersQuerySchemaType,
    GetCustomerDetailsSchemaType,
    UpdateCustomerDetailsSchemaType,
    UpdateCustomerRoleSchemaType,
    UpdateCustomerStatusSchemaType,
};
