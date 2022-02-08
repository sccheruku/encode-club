import { range, random } from "lodash";
import { generateNftData } from "../utils/common";

export default function handler(req, res) {


    res.status(200).json(
        range(0, 12, 1).map(i => generateNftData()).map(record => ({
            ...record, metadata: record.token_metadata
        }))
    )
}
