import { CreateCustomerSchema, SearchCustomersQuerySchema } from "./customer.validation.ts";
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
        const queries = SearchCustomersQuerySchema.parse(request.query);
        const data = await this.service.search(queries);

        return response.status(STATUS_CODES.OK).json({
            status: RESPONSE_STATUS_CODES.OPERATION_SUCCESSFULL,

            entity: {
                customers: data.customers,
                pagination: {
                    limit: queries.limit,
                    currentPage: queries.currentPage,
                    totalPages: data.totalPages,
                    totalCount: data.count,
                },
            },
        });
    });
}
