import { Product } from "../models/productModel.js";

export const catCtrl = {


    getCategories: async (req, res) => {
        try {
            const categories = await Product.distinct('category'); // Get distinct categories
            res.json({ status: 'success', categories });
        } catch (err) {
            console.error("Error in getCategories:", err);
            res.status(500).json({ msg: err.message });
        }
    }
};