import { z } from "zod";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export const OrderItemSchema = z.object({
    code: z.string(),
    size: z.string(),
    quantity: z.number().min(1),
});

// Separate schemas for different endpoints
export const OrderCheckSchema = z.object({
    body: z.array(OrderItemSchema),
});
export const OrderRequestSchema = z.array(OrderItemSchema);

export type OrderRequest = z.infer<typeof OrderRequestSchema>;

export const registerOrderSchemas = (registry: OpenAPIRegistry) => {
    registry.register("OrderItem", OrderItemSchema);
};
