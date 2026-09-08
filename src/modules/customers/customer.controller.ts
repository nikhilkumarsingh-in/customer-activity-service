import { CreateCustomerSchema } from "./customer.validation.ts";
import { CustomerService } from "./customer.service.ts";

import { RESPONSE_STATUS_CODES, STATUS_CODES } from "../../lib/application-errors.lib.ts";
import { handleAsynchronousRequest } from "../../middleware/request-handler.middleware.ts";

export class CustomerController {
    private readonly service: CustomerService;

    constructor() {
        this.service = new CustomerService();
    }

    public create = handleAsynchronousRequest(async (request, response) => {
        const details = CreateCustomerSchema.parse(request.body);
        const customer = await this.service.create(details);

        return response
            .status(STATUS_CODES.CREATED)
            .json({ status: RESPONSE_STATUS_CODES.OPERATION_SUCCESSFULL, entity: { customer } });
    });

    public search = handleAsynchronousRequest(async (request, response) => {
        const limit = Number(request.query["limit"]?.toString() || "10");
        const page = Number(request.query["page"]?.toString() || "1");
        const sort = request.query["sort"]?.toString() || "fullName=asc";
        const keyword = request.query["keyword"]?.toString();
        const statuses = request.query["statuses"]?.toString();
        const roles = request.query["roles"]?.toString();

        const data = await this.service.search({ limit, page, sort, keyword, statuses, roles });

        return response.status(STATUS_CODES.OK).json({
            status: RESPONSE_STATUS_CODES.OPERATION_SUCCESSFULL,
            entity: { customers: data.customers, pagination: { limit, page, pages: data.pages, count: data.count } },
        });
    });
}
