import Product from "../models/Product.js";
export const getProductSuggestions = async (req, res) => {
    try {
        const searchQuery = req.query["searchQuery"];
        const suggestions = [];
        const products = await Product.find({
            $or: [{ title: { $regex: searchQuery, $options: "i" } }],
        }).select({ brand: 1, title: 1, _id: 0 });
        products.forEach(({ brand, title }) => {
            if (!suggestions.includes(brand)) {
                suggestions.push(brand);
            }
            if (!suggestions.includes(title)) {
                suggestions.push(title);
            }
        });
        return res.status(200).json({
            success: true,
            data: suggestions,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error.",
        });
    }
};
export const searchProduct = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error.",
        });
    }
};
