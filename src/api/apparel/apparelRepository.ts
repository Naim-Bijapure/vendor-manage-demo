import { ApparelModel } from "./apparelModel";
import type { Apparel, UpdateApparelParams, UpdateApparelBody, BulkUpdateApparel } from "./apparelSchema";

export class ApparelRepository {
    async updateStock(params: UpdateApparelParams, body: UpdateApparelBody): Promise<Apparel> {
        const data = await ApparelModel.loadData();

        if (!data[params.code]) {
            data[params.code] = { sizes: {} };
        }

        data[params.code].sizes[params.size] = {
            quantity: body.quantity,
            price: body.price,
        };

        await ApparelModel.saveData(data);
        return this.mapToApparel(params.code, data[params.code]);
    }

    async bulkUpdateStock(updates: BulkUpdateApparel): Promise<Apparel[]> {
        const data = await ApparelModel.loadData();
        const results: Apparel[] = [];

        for (const update of updates) {
            if (!data[update.code]) {
                data[update.code] = { sizes: {} };
            }

            data[update.code].sizes[update.size] = {
                quantity: update.quantity,
                price: update.price,
            };

            results.push(this.mapToApparel(update.code, data[update.code]));
        }

        await ApparelModel.saveData(data);
        return results;
    }

    private mapToApparel(code: string, data: { sizes: Record<string, { quantity: number; price: number }> }): Apparel {
        return {
            code,
            sizes: Object.entries(data.sizes).map(([size, details]) => ({
                size,
                quantity: details.quantity,
                price: details.price,
            })),
        };
    }

    async getAllApparel(): Promise<Apparel[]> {
        const data = await ApparelModel.loadData();
        return Object.entries(data).map(([code, details]) => this.mapToApparel(code, details));
    }

    async getApparel(code: string, size?: string): Promise<Apparel> {
        const data = await ApparelModel.loadData();
        const details = data[code];
        if (!details) {
            throw new Error("Apparel not found");
        }

        if (size) {
            if (!details.sizes[size]) {
                throw new Error("Size not found");
            }
            return {
                code,
                sizes: [
                    {
                        size,
                        quantity: details.sizes[size].quantity,
                        price: details.sizes[size].price,
                    },
                ],
            };
        }

        return this.mapToApparel(code, details);
    }
}
