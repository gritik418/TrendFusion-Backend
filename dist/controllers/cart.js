import User from "../models/User.js";
import Cart from "../models/Cart.js";
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
        const product = req.body.product;
        if (!product)
            return res.status(400).json({
                success: false,
                message: "Product not found.",
            });
        const user = await User.findById(userId);
        let discount = 0;
        if (product?.unitDiscount) {
            if (product.unitDiscount.discountType === "Percentage") {
                discount = (product.unitPrice * product.unitDiscount.value) / 100;
            }
            else {
                discount = product.unitDiscount.value;
            }
        }
        if (!user)
            return res.status(401).json({
                success: false,
                message: "User not found.",
            });
        const checkCart = await Cart.findOne({ userId });
        const cartDiscount = checkCart?.discount
            ? (checkCart.discount += discount)
            : discount;
        let alreadyAdded = false;
        let duplicateProduct;
        checkCart?.items.forEach((item) => {
            if (item.productId.toString() === product.productId) {
                alreadyAdded = true;
                duplicateProduct = item;
            }
        });
        if (checkCart) {
            if (alreadyAdded && duplicateProduct?.productId) {
                const filteredItems = checkCart.items.filter((item) => item.productId.toString() !== product.productId);
                const cartItems = [
                    ...filteredItems,
                    {
                        ...duplicateProduct,
                        quantity: (duplicateProduct.quantity += 1),
                    },
                ];
                await Cart.findOneAndUpdate({ userId }, {
                    $set: {
                        items: cartItems,
                        totalPrice: checkCart.totalPrice + product.unitPrice,
                        discount: cartDiscount,
                        finalPrice: checkCart.finalPrice + (product.unitPrice - discount),
                        totalQuantity: checkCart.totalQuantity + product.quantity,
                    },
                });
            }
            else {
                await Cart.findOneAndUpdate({ userId }, {
                    $push: { items: product },
                    $set: {
                        totalPrice: checkCart.totalPrice + product.unitPrice,
                        discount: cartDiscount,
                        finalPrice: checkCart.finalPrice + (product.unitPrice - discount),
                        totalQuantity: checkCart.totalQuantity + product.quantity,
                    },
                });
            }
        }
        else {
            const newCart = new Cart({
                userId,
                discount,
                totalPrice: product.unitPrice,
                finalPrice: product.unitPrice - discount,
                items: [product],
                totalQuantity: product.quantity,
            });
            await newCart.save();
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
