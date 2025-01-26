import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Router } from "express";
import { z } from "zod";
import { validateRequest } from "../../common/utils/httpHandlers";
import { apparelController } from "./apparelController";
import {
    registerApparelSchemas,
    UpdateApparelSchema,
    BulkUpdateApparelSchema,
    ApparelSchema,
    GetAllApparelSchema,
    GetApparelSchema,
} from "./apparelSchema";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";

export const apparelRegistry = new OpenAPIRegistry();
registerApparelSchemas(apparelRegistry);

export const apparelRouter: Router = express.Router();

apparelRegistry.register("Apparel", UpdateApparelSchema);

// Single update endpoint
apparelRegistry.registerPath({
    method: "put",
    path: "/apparel/{code}/{size}",
    tags: ["Apparel"],
    request: {
        params: UpdateApparelSchema.shape.params,
        body: { content: { "application/json": { schema: UpdateApparelSchema.shape.body } } },
    },
    responses: createApiResponse(ApparelSchema, "Success"),
});

apparelRouter.put("/:code/:size", validateRequest(UpdateApparelSchema), apparelController.updateStock);

// Bulk update endpoint
apparelRegistry.registerPath({
    method: "put",
    path: "/apparel/bulk",
    tags: ["Apparel"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: BulkUpdateApparelSchema.shape.body, // Reference array schema
                },
            },
        },
    },
    responses: createApiResponse(z.array(ApparelSchema), "Success"),
});

apparelRouter.put("/bulk", validateRequest(BulkUpdateApparelSchema), apparelController.bulkUpdate);

// Get all apparel (paginated)
apparelRegistry.registerPath({
    method: "get",
    path: "/apparel",
    tags: ["Apparel"],
    request: {
        query: GetAllApparelSchema.shape.query,
    },
    responses: createApiResponse(z.array(ApparelSchema), "Success"),
});
apparelRouter.get("/", validateRequest(GetAllApparelSchema), apparelController.getAllApparel);

// Get specific apparel
apparelRegistry.registerPath({
    method: "get",
    path: "/apparel/{code}/{size}", // Use OpenAPI-style parameters
    tags: ["Apparel"],
    request: {
        params: GetApparelSchema.shape.params,
    },
    responses: createApiResponse(ApparelSchema, "Success"),
});
apparelRouter.get("/:code/:size?", validateRequest(GetApparelSchema), apparelController.getApparel);
