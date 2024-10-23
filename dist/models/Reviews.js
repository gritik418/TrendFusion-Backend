import mongoose, { model, Schema } from "mongoose";
const ReviewsSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    images: [
        {
            type: String,
        },
    ],
}, { timestamps: true });
const Reviews = mongoose.models.Reviews ||
    model("Reviews", ReviewsSchema);
export default Reviews;
