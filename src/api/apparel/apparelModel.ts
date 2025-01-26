import fs from "fs/promises";
import path from "path";
import type { Apparel } from "./apparelSchema";

type ApparelData = Record<
    string,
    {
        sizes: Record<
            string,
            {
                quantity: number;
                price: number;
            }
        >;
    }
>;

export class ApparelModel {
    private static readonly DATA_PATH = path.resolve(__dirname, "../../data.json");

    static async loadData(): Promise<ApparelData> {
        try {
            const data = await fs.readFile(this.DATA_PATH, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            return {};
        }
    }

    static async saveData(data: ApparelData): Promise<void> {
        await fs.writeFile(this.DATA_PATH, JSON.stringify(data, null, 2));
    }
}
