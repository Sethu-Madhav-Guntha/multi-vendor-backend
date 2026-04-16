import { Schema, model } from "mongoose";

const orderSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        items: [
            {
                product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true, min: 1 },
                price: { type: Number, required: true }
            }
        ],
        store: { type: Schema.Types.ObjectId, ref: "Store", required: true },
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: ["Pending", "Accepted", "Delivered", "Canceled"],
            default: "Pending"
        }
    },
    { timestamps: true }
);

export default model("Order", orderSchema);
