import User from "../models/User.js";
import Cart from "../models/Cart.js";
export const getUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select({
            verificationCodeExpiry: 0,
            verificationCode: 0,
            provider: 0,
        });
        const cart = await Cart.findOne({ userId }).select({
            totalQuantity: 1,
            _id: 0,
        });
        if (!user || !userId) {
            return res.status(401).json({
                success: false,
                message: "User not found.",
            });
        }
        return res.status(200).json({
            success: true,
            data: user,
            cartCount: cart?.totalQuantity || 0,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error.",
        });
    }
};
