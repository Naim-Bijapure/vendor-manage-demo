import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Router } from "express";
import { z } from "zod";
import { validateRequest } from "../../common/utils/httpHandlers";
import { orderController } from "./orderController";
import { OrderCheckSchema, registerOrderSchemas } from "./orderSchema";

export const orderRegistry = new OpenAPIRegistry();
registerOrderSchemas(orderRegistry);

export const orderRouter: Router = express.Router();

// Check fulfillment endpoint
orderRegistry.registerPath({
    method: "post",
    path: "/orders/check",
    tags: ["Order"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: OrderCheckSchema.shape.body,
                },
            },
        },
    },
    responses: createApiResponse(z.boolean(), "Success"),
});

orderRouter.post("/check", validateRequest(OrderCheckSchema), orderController.checkFulfillment);

// Calculate cost endpoint
orderRegistry.registerPath({
    method: "post",
    path: "/orders/calculate",
    tags: ["Order"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: OrderCheckSchema.shape.body,
                },
            },
        },
    },
    responses: createApiResponse(z.number(), "Success"),
});

orderRouter.post("/calculate", validateRequest(OrderCheckSchema), orderController.calculateLowestCost);
