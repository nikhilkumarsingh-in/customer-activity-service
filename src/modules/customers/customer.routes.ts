import { Router } from "express";

import { CustomerController } from "./customer.controller.ts";

export class CustomerRoutes {
    public readonly router: Router;
    private readonly controller: CustomerController;

    constructor() {
        this.router = Router();
        this.controller = new CustomerController();

        this.handleConfigureRoutes();
    }

    private handleConfigureRoutes() {
        this.router.post("/", this.controller.create.bind(this.controller));
        this.router.get("/", this.controller.search.bind(this.controller));
    }
}
