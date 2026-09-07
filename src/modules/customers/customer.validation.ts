import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import { CUSTOMER_ROLES } from "../../constants/customer.constant.ts";

export const CreateCustomerSchema = z.object(
    {
        fullName: z
            .string({ error: "Customer full name is required for the profile identification." })
            .trim()
            .min(3, { error: "Full name must of at least 3 characters long." })
            .max(128, { error: "Provided full name exceeds the maximum allowed limit of 128 characters." }),
        emailAddress: z
            .email({ error: "Provided email address is in invalid format." })
            .trim()
            .max(256, { error: "Provided email address exceeds the maximum allowed limit of 256 characters." })
            .toLowerCase()
            .optional()
            .nullable(),
        phoneNumber: z
            .string({ error: "Phone number is required for saving contact details." })
            .transform((value, ctx) => {
                const parsed = parsePhoneNumberFromString(value.trim(), "IN");

                if (!parsed?.isValid()) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Provided phone number for the contact details is invalid.",
                    });

                    return z.NEVER;
                }

                return parsed.number;
            }),
        role: z.enum(CUSTOMER_ROLES, { error: "Provided role cannot be used to create a new entry." }),
    },
    { error: "Please fill out all the required fields to continue." }
);

export type CreateCustomerSchemaType = z.infer<typeof CreateCustomerSchema>;
