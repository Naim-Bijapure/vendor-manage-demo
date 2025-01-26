import { Request, Response } from "express";
import { ApparelRepository } from "./apparelRepository";
import { UpdateApparelParams, UpdateApparelBody, BulkUpdateApparel } from "./apparelSchema";

export class ApparelController {
    private repository: ApparelRepository;

    constructor() {
        // Proper initialization
        this.repository = new ApparelRepository();

        // Bind context for Express middleware
        this.updateStock = this.updateStock.bind(this);
        this.bulkUpdate = this.bulkUpdate.bind(this);
        this.getAllApparel = this.getAllApparel.bind(this);
        this.getApparel = this.getApparel.bind(this);
    }

    async updateStock(req: Request, res: Response) {
        try {
            const apparel = await this.repository.updateStock(
                req.params as UpdateApparelParams,
                req.body as UpdateApparelBody
            );
            res.json({ success: true, data: apparel });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: "Internal server error",
            });
        }
    }
    async bulkUpdate(req: Request, res: Response) {
        try {
            // Access body through validated request
            const updates = req.body; // Now properly typed as array
            const results = await this.repository.bulkUpdateStock(updates);
            res.json({ success: true, data: results });
        } catch (error) {
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }

    async getApparel(req: Request, res: Response) {
        try {
            const { code, size } = req.params;
            const apparel = await this.repository.getApparel(code, size);
            res.json({ success: true, data: apparel });
        } catch (error: any) {
            res.status(404).json({ success: false, error: error.message });
        }
    }

    async getAllApparel(req: Request, res: Response) {
        try {
            // Convert query params to numbers explicitly
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const allApparel = await this.repository.getAllApparel();

            const start = (page - 1) * limit;
            const end = start + limit;
            const paginated = allApparel.slice(start, end);

            res.json({
                success: true,
                data: paginated,
                pagination: {
                    total: allApparel.length,
                    page,
                    limit,
                    totalPages: Math.ceil(allApparel.length / limit),
                },
            });
        } catch (error) {
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }
}

// Proper singleton instance export
export const apparelController = new ApparelController();
