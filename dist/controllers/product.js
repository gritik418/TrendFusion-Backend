import Product from "../models/Product.js";
export const getProductSuggestions = async (req, res) => {
    try {
        const searchQuery = req.query["searchQuery"];
        const suggestions = [];
        const products = await Product.find({
            $or: [
                { title: { $regex: searchQuery, $options: "i" } },
                { brand: { $regex: searchQuery, $options: "i" } },
                { category: { $regex: searchQuery, $options: "i" } },
            ],
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
        const searchQuery = req.query["searchQuery"];
        const category = req.query["category"];
        const brands = req.query["brand"];
        const colors = req.query["color"];
        const size = req.query["size"];
        const min = req.query["min"];
        const max = req.query["max"];
        let filterQueries = {
            brands: [],
            categories: [],
            colors: [],
            size: [],
        };
        if (category) {
            if (typeof category === "object") {
                filterQueries.categories = category;
            }
            else {
                filterQueries.categories = [category];
            }
        }
        if (brands) {
            if (typeof brands === "object") {
                filterQueries.brands = brands;
            }
            else {
                filterQueries.brands = [brands];
            }
        }
        if (colors) {
            if (typeof colors === "object") {
                filterQueries.colors = colors;
            }
            else {
                filterQueries.colors = [colors];
            }
        }
        if (size) {
            if (typeof size === "object") {
                filterQueries.size = size;
            }
            else {
                filterQueries.size = [size];
            }
        }
        let filterObject = {};
        if (filterQueries.brands.length > 0) {
            filterObject.brand = { $in: filterQueries.brands };
        }
        if (filterQueries.categories.length > 0) {
            filterObject.category = { $in: filterQueries.categories };
        }
        if (filterQueries.size.length > 0) {
            filterObject.size = { $in: filterQueries.size };
        }
        if (filterQueries.colors.length > 0) {
            filterObject["color.colorName"] = { $in: filterQueries.colors };
        }
        let priceFilter = {};
        priceFilter["$gte"] = 0;
        if (min) {
            priceFilter["$gte"] = Number(min) || 0;
        }
        if (max) {
            priceFilter["$lte"] = Number(max);
        }
        const products = await Product.find({
            $or: [
                { title: { $regex: searchQuery, $options: "i" } },
                { brand: { $regex: searchQuery, $options: "i" } },
                { description: { $regex: searchQuery, $options: "i" } },
                { category: { $regex: searchQuery, $options: "i" } },
            ],
            price: { ...priceFilter },
            ...filterObject,
        });
        if (products.length === 0) {
            return res.status(200).json({
                success: true,
                products: [],
            });
        }
        let minPrice = products[0].price;
        let maxPrice = products[0].price;
        let filters = {
            brands: [],
            categories: [],
            colors: [],
            size: [],
        };
        products?.forEach((product) => {
            if (product.brand) {
                if (!filters.brands.includes(product?.brand)) {
                    filters.brands.push(product.brand);
                }
            }
            if (product.category) {
                if (!filters.categories.includes(product?.category)) {
                    filters.categories.push(product.category);
                }
            }
            if (product.color) {
                if (!filters.colors.includes(product?.color.colorName)) {
                    filters.colors.push(product.color.colorName);
                }
            }
            if (product.size) {
                if (!filters.size.includes(product?.size)) {
                    filters.size.push(product.size);
                }
            }
            if (minPrice > product.price) {
                minPrice = product.price;
            }
            if (maxPrice < product.price) {
                maxPrice = product.price;
            }
        });
        return res.status(200).json({
            success: true,
            products,
            filters,
            minPrice,
            maxPrice,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error.",
        });
    }
};
export const getProductByProductId = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId)
            return res.status(200).json({
                success: false,
                message: "Product Id not found.",
            });
        const product = await Product.findOne({
            productId,
        });
        const variants = {};
        if (product && product.title && product.color && product.size) {
            const variantProducts = await Product.find({ title: product.title });
            variantProducts.forEach((product) => {
                if (product.color) {
                    if (!Object.keys(variants).includes(product.color.colorName)) {
                        variants[product.color.colorName] = {
                            colorName: product.color.colorName,
                            colorImage: product.color.colorImage,
                            size: [],
                        };
                        if (!variants[product.color.colorName].size?.includes({
                            slug: product.productId,
                            size: product.size || "",
                        })) {
                            variants[product.color.colorName].size?.push({
                                size: product.size || "",
                                slug: product.productId,
                            });
                        }
                    }
                    else {
                        if (!variants[product.color.colorName].size?.includes({
                            slug: product.productId,
                            size: product.size || "",
                        })) {
                            variants[product.color.colorName].size?.push({
                                size: product.size || "",
                                slug: product.productId,
                            });
                        }
                    }
                }
            });
        }
        if (!product)
            return res.status(200).json({
                success: false,
                message: "Product not found.",
            });
        return res.status(200).json({
            success: true,
            product,
            variants: Object.values(variants),
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error.",
        });
    }
};
export const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId)
            return res.status(200).json({
                success: false,
                message: "Product Id not found.",
            });
        const product = await Product.findById(productId);
        if (!product)
            return res.status(400).json({
                success: false,
                message: "Product not found.",
            });
        return res.status(200).json({
            success: true,
            product,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error.",
        });
    }
};
