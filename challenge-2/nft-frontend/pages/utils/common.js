import * as f from "community-faker";
import { range, random } from "lodash";

export function generateNftData() {
    return {
        token_id: random(10000000, false).toString(),
        token_metadata: {
            title: f.commerce.productName(),
            copies: 1,
            description: f.commerce.productDescription(),
            media: f.image.image()
        }
    }
}