import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
export const getCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId)
            return res.status(401).json({
                success: false,
                message: "User not found.",
            });
        const cart = await Cart.findOne({ userId });
        if (!cart)
            return res.status(200).json({
                success: true,
                message: "Cart is Empty.",
            });
        return res.status(200).json({
            success: true,
            message: "Cart is Empty.",
            cart,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error.",
        });
    }
};
export const addToCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        const productId = req.body.productId;
        const quantity = req.body.quantity || 1;
        const product = await Product.findById(productId);
        if (!product || !productId)
            return res.status(400).json({
                success: false,
                message: "Product not found.",
            });
        const checkCart = await Cart.findOne({ userId });
        if (!checkCart) {
            const newCart = new Cart({
                userId,
                items: [{ product: productId, quantity: quantity }],
                totalQuantity: quantity,
            });
            await newCart.save();
            return res.status(200).json({
                success: true,
                message: "Added to Cart.",
            });
        }
        let alreadyAdded = false;
        let duplicateProduct;
        let addedQuantity = 0;
        checkCart?.items.forEach((item) => {
            if (item.product.toString() === product._id.toString()) {
                alreadyAdded = true;
                duplicateProduct = item.product;
                addedQuantity = item.quantity;
            }
        });
        if (product?.stock < addedQuantity + quantity) {
            return res.status(200).json({
                success: true,
                message: "Stock not available.",
            });
        }
        if (alreadyAdded && duplicateProduct) {
            const filteredItems = checkCart.items.filter((item) => item.product.toString() !== product._id.toString());
            const cartItems = [
                ...filteredItems,
                {
                    product: duplicateProduct,
                    quantity: (addedQuantity += quantity),
                },
            ];
            await Cart.findOneAndUpdate({ userId }, {
                $set: {
                    items: cartItems,
                    totalQuantity: checkCart.totalQuantity + quantity,
                },
            });
        }
        else {
            await Cart.findOneAndUpdate({ userId }, {
                $push: { items: { product: product._id, quantity } },
                $set: {
                    totalQuantity: checkCart.totalQuantity + quantity,
                },
            });
        }
        return res.status(200).json({
            success: true,
            message: "Added to Cart.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error.",
        });
    }
};
export const incrementProductQuantity = async (req, res) => {
    try {
        const userId = req.params.userId;
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        if (!productId || !product)
            return res.status(400).json({
                success: false,
                message: "Product not found.",
            });
        const cart = await Cart.findOne({ userId });
        if (!cart)
            return res.status(400).json({
                success: false,
                message: "Cart not found.",
            });
        let duplicateProduct;
        let addedQuantity = 0;
        cart?.items.forEach((item) => {
            if (item.product.toString() === product?._id.toString()) {
                duplicateProduct = item.product;
                addedQuantity = item.quantity;
            }
        });
        if (!duplicateProduct) {
            return res.status(400).json({
                success: false,
                message: "Product not found.",
            });
        }
        if (product?.stock < addedQuantity + 1) {
            return res.status(200).json({
                success: true,
                message: "Stock not available.",
            });
        }
        const filteredItems = cart?.items.filter((item) => item.product.toString() !== product._id.toString()) || [];
        const cartItems = [
            ...filteredItems,
            {
                product: duplicateProduct,
                quantity: addedQuantity + 1,
            },
        ];
        await Cart.findOneAndUpdate({ userId }, {
            $set: {
                items: cartItems,
                totalQuantity: cart.totalQuantity + 1,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Added to Cart.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error.",
        });
    }
};
export const decrementProductQuantity = async (req, res) => {
    try {
        const userId = req.params.userId;
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        if (!productId || !product)
            return res.status(400).json({
                success: false,
                message: "Product not found.",
            });
        const cart = await Cart.findOne({ userId });
        if (!cart)
            return res.status(400).json({
                success: false,
                message: "Cart not found.",
            });
        let duplicateProduct;
        let addedQuantity = 0;
        cart?.items.forEach((item) => {
            if (item.product.toString() === product?._id.toString()) {
                duplicateProduct = item.product;
                addedQuantity = item.quantity;
            }
        });
        if (addedQuantity === 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity is 1 cannot decrement.",
            });
        }
        if (!duplicateProduct) {
            return res.status(400).json({
                success: false,
                message: "Product not found.",
            });
        }
        const filteredItems = cart?.items.filter((item) => item.product.toString() !== product._id.toString()) || [];
        const cartItems = [
            ...filteredItems,
            {
                product: duplicateProduct,
                quantity: addedQuantity - 1,
            },
        ];
        await Cart.findOneAndUpdate({ userId }, {
            $set: {
                items: cartItems,
                totalQuantity: cart.totalQuantity - 1,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Quantity decremented.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error.",
        });
    }
};
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        if (!productId || !product)
            return res.status(400).json({
                success: false,
                message: "Product not found.",
            });
        const cart = await Cart.findOne({ userId });
        if (!cart)
            return res.status(400).json({
                success: false,
                message: "Cart not found.",
            });
        let productToBeRemoved;
        let addedQuantity = 0;
        cart?.items.forEach((item) => {
            if (item.product.toString() === product?._id.toString()) {
                productToBeRemoved = item.product;
                addedQuantity = item.quantity;
            }
        });
        if (!productToBeRemoved) {
            return res.status(400).json({
                success: false,
                message: "Product not found.",
            });
        }
        const filteredItems = cart?.items.filter((item) => item.product.toString() !== product._id.toString()) || [];
        await Cart.findOneAndUpdate({ userId }, {
            $set: {
                items: filteredItems,
                totalQuantity: cart.totalQuantity - addedQuantity,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Item removed.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error.",
        });
    }
};
