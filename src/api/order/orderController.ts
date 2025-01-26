import { Request, Response } from "express";
import { OrderRepository } from "./orderRepository";
import type { OrderRequest } from "./orderSchema";

export class OrderController {
    private repository: OrderRepository;

    constructor() {
        this.repository = new OrderRepository();

        this.checkFulfillment = this.checkFulfillment.bind(this);
        this.calculateLowestCost = this.calculateLowestCost.bind(this);
    }

    async checkFulfillment(req: Request, res: Response) {
        try {
            const items = req.body; // Now properly typed as OrderItem[]
            const canFulfill = await this.repository.checkFulfillment(items);
            res.json({ success: true, canFulfill });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: "Internal server error",
            });
        }
    }
    async calculateLowestCost(req: Request, res: Response) {
        try {
            const items = req.body; // Direct array access
            const total = await this.repository.calculateLowestCost(items);
            res.json({ success: true, total });
        } catch (error: any) {
            const status = error.message.startsWith("Cannot fulfill") ? 400 : 500;
            res.status(status).json({
                success: false,
                error: error.message,
            });
        }
    }
}

export const orderController = new OrderController();
