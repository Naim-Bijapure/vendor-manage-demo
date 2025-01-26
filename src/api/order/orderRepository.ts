import { ApparelModel } from "../apparel/apparelModel";
import type { OrderRequest } from "./orderSchema";

export class OrderRepository {
    private async getAggregatedOrder(items: OrderRequest) {
        const aggregated = new Map<string, number>();
        for (const item of items) {
            const key = `${item.code}-${item.size}`;
            aggregated.set(key, (aggregated.get(key) || 0) + item.quantity);
        }
        return Array.from(aggregated).map(([key, quantity]) => {
            const [code, size] = key.split("-");
            return { code, size, quantity };
        });
    }

    async checkFulfillment(items: OrderRequest): Promise<boolean> {
        const data = await ApparelModel.loadData();
        const aggregated = await this.getAggregatedOrder(items);

        return aggregated.every(({ code, size, quantity }) => {
            const stock = data[code]?.sizes?.[size];
            return stock && stock.quantity >= quantity;
        });
    }

    async calculateLowestCost(items: OrderRequest): Promise<number> {
        const data = await ApparelModel.loadData();
        const aggregated = await this.getAggregatedOrder(items);
        let total = 0;

        for (const { code, size, quantity } of aggregated) {
            const stock = data[code]?.sizes?.[size];
            if (!stock || stock.quantity < quantity) {
                throw new Error(`Cannot fulfill order for ${code} size ${size}`);
            }
            total += stock.price * quantity;
        }

        return total;
    }
}
