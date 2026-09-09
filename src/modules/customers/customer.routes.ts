import { Router } from "express";

import { CustomerController } from "./customer.controller.ts";
import { handleCreateCustomRateLimitMiddleware } from "../../middleware/rate-limit.middleware.ts";
import { CUSTOMER_ROUTES } from "./contract/customer-routes.contract.ts";

export class CustomerRoutes {
    public readonly router: Router;
    private readonly controller: CustomerController;

    constructor() {
        this.router = Router();
        this.controller = new CustomerController();

        this.handleConfigureRoutes();
    }

    private handleConfigureRoutes() {
        this.router.post(
            CUSTOMER_ROUTES.CREATE_NEW_CUSTOMER_PROFILE.ENDPOINT,
            handleCreateCustomRateLimitMiddleware(CUSTOMER_ROUTES.CREATE_NEW_CUSTOMER_PROFILE.RATE_LIMIT),
            this.controller.create.bind(this.controller)
        );

        this.router.get(
            CUSTOMER_ROUTES.SEARCH_CUSTOMER_PROFILES.ENDPOINT,
            this.controller.search.bind(this.controller)
        );

        this.router.get(
            CUSTOMER_ROUTES.GET_CUSTOMER_TIMELINE.ENDPOINT,
            this.controller.getTimeline.bind(this.controller)
        );

        this.router.get(
            CUSTOMER_ROUTES.GET_CUSTOMER_PROFILE_DETAILS.ENDPOINT,
            this.controller.details.bind(this.controller)
        );

        this.router.patch(
            CUSTOMER_ROUTES.UPDATE_CUSTOMER_PROFILE_DETAILS.ENDPOINT,
            handleCreateCustomRateLimitMiddleware(CUSTOMER_ROUTES.UPDATE_CUSTOMER_PROFILE_DETAILS.RATE_LIMIT),
            this.controller.updateDetails.bind(this.controller)
        );
        this.router.patch(
            CUSTOMER_ROUTES.UPDATE_CUSTOMER_PROFILE_STATUS.ENDPOINT,
            handleCreateCustomRateLimitMiddleware(CUSTOMER_ROUTES.UPDATE_CUSTOMER_PROFILE_STATUS.RATE_LIMIT),
            this.controller.updateStatus.bind(this.controller)
        );

        this.router.delete(
            CUSTOMER_ROUTES.DELETE_CUSTOMER_PROFILE.ENDPOINT,
            handleCreateCustomRateLimitMiddleware(CUSTOMER_ROUTES.DELETE_CUSTOMER_PROFILE.RATE_LIMIT),
            this.controller.delete.bind(this.controller)
        );
    }
}
