import { z } from "zod";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export const ApparelSizeSchema = z.object({
    size: z.string(),
    quantity: z.number().min(0),
    price: z.number().min(0),
});

export const ApparelSchema = z.object({
    code: z.string(),
    sizes: z.array(ApparelSizeSchema),
});

// Export inferred types
export type Apparel = z.infer<typeof ApparelSchema>;
export type ApparelSize = z.infer<typeof ApparelSizeSchema>;

// Update schema with proper typing
export const UpdateApparelSchema = z.object({
    params: z.object({
        code: z.string(),
        size: z.string(),
    }),
    body: z.object({
        quantity: z.number().min(0),
        price: z.number().min(0),
    }),
});

export type UpdateApparelParams = z.infer<typeof UpdateApparelSchema>["params"];
export type UpdateApparelBody = z.infer<typeof UpdateApparelSchema>["body"];

export const BulkUpdateApparelSchema = z.object({
    body: z.array(
        z.object({
            code: z.string(),
            size: z.string(),
            quantity: z.number().min(0),
            price: z.number().min(0),
        })
    ),
});
export type BulkUpdateApparel = z.infer<typeof BulkUpdateApparelSchema>;

export const registerApparelSchemas = (registry: OpenAPIRegistry) => {
    registry.register("Apparel", ApparelSchema);
    registry.register("ApparelSize", ApparelSizeSchema);
};

export const GetApparelSchema = z.object({
    params: z.object({
        code: z.string().min(1),
        size: z.string().optional(),
    }),
});

export const GetAllApparelSchema = z.object({
    query: z.object({
        page: z.coerce.number().min(1).default(1), // Changed to coerce
        limit: z.coerce.number().min(1).max(100).default(10), // Changed to coerce
    }),
});
