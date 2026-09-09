const CUSTOMER_STATUSES = {
    ACCOUNT_IS_ACTIVE: "account_is_active",
    SUSPENDED_BY_MANAGEMENT: "suspended_by_management",
    ACCOUNT_WAS_DELETED: "account_was_deleted",
} as const;

type CustomerStatus = (typeof CUSTOMER_STATUSES)[keyof typeof CUSTOMER_STATUSES];

const CUSTOMER_ROLES = { ENTERPRISE: "enterprise", INDIVIDUAL: "individual" } as const;

type CustomerRole = (typeof CUSTOMER_ROLES)[keyof typeof CUSTOMER_ROLES];

const CUSTOMER_ACTIVITY_TYPES = {
    PROFILE_CREATED: "customer_profile_created",
    UPDATE_PROFILE_DETAILS: "update_customer_profile_details",
    UPDATE_PROFILE_STATUS: "update_customer_profile_status",
} as const;

type CustomerActivityType = (typeof CUSTOMER_ACTIVITY_TYPES)[keyof typeof CUSTOMER_ACTIVITY_TYPES];

export { CUSTOMER_STATUSES, CUSTOMER_ROLES, CUSTOMER_ACTIVITY_TYPES };
export type { CustomerStatus, CustomerRole, CustomerActivityType };
