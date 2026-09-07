import { Router } from "express";

import { CustomerRoutes } from "./customers/customer.routes.ts";

export class ModuleRoutes {
    public readonly router: Router;
    private readonly customers: CustomerRoutes;

    constructor() {
        this.router = Router();
        this.customers = new CustomerRoutes();

        this.handleConfigureRoutes();
    }

    private handleConfigureRoutes() {
        this.router.use("/customers", this.customers.router);
    }
}
