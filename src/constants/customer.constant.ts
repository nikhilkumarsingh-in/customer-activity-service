const CUSTOMER_STATUSES = {
    ACTIVE_IS_ACTIVE: "account_is_active",
    SUSPENDED_BY_MANAGEMENT: "suspended_by_management",
    ACCOUNT_WAS_DELETED: "account_was_deleted",
} as const;

const CUSTOMER_ROLES = { ENTERPRISE: "enterprise", INDIVIDUAL: "individual" } as const;

type CustomerStatus = (typeof CUSTOMER_STATUSES)[keyof typeof CUSTOMER_STATUSES];
type CustomerRole = (typeof CUSTOMER_ROLES)[keyof typeof CUSTOMER_ROLES];

export { CUSTOMER_STATUSES, CUSTOMER_ROLES };
export type { CustomerStatus, CustomerRole };
