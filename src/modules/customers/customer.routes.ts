import { Router } from "express";

import { CustomerController } from "./customer.controller.ts";
import { handleCreateCustomRateLimitMiddlewareForRoute } from "../../middleware/rate-limit.middleware.ts";

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
            "/",
            handleCreateCustomRateLimitMiddlewareForRoute(10),
            this.controller.create.bind(this.controller)
        );

        this.router.get("/", this.controller.search.bind(this.controller));
        this.router.get("/:id", this.controller.details.bind(this.controller));

        this.router.patch("/:id", this.controller.updateDetails.bind(this.controller));
        this.router.patch("/:id/status", this.controller.updateStatus.bind(this.controller));

        this.router.delete("/:id", this.controller.delete.bind(this.controller));
    }
}
