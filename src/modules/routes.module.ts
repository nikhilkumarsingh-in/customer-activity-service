import { Router } from "express";

export class ModuleRoutes {
    public readonly router: Router;

    constructor() {
        this.router = Router();
    }
}
