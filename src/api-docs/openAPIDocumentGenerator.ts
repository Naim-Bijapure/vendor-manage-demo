import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

import { healthCheckRegistry } from "@/api/healthCheck/healthCheckRouter";
import { userRegistry } from "@/api/user/userRouter";
import { apparelRegistry } from "@/api/apparel/apparelRouter";
import { orderRegistry } from "@/api/order/orderRouter";

export function generateOpenAPIDocument() {
    const registry = new OpenAPIRegistry([healthCheckRegistry, userRegistry, apparelRegistry, orderRegistry]);
    const generator = new OpenApiGeneratorV3(registry.definitions);

    return generator.generateDocument({
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "Swagger API",
        },
        externalDocs: {
            description: "View the raw OpenAPI Specification in JSON format",
            url: "/swagger.json",
        },
    });
}
