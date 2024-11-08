import mongoose, { model, Schema } from "mongoose";
const CartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
                default: 1,
            },
            updatedAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    totalQuantity: {
        type: Number,
        default: 1,
    },
}, { timestamps: true });
const Cart = mongoose.models.Cart ||
    model("Cart", CartSchema);
export default Cart;
