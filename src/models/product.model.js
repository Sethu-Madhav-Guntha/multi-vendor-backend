import { model, Schema } from "mongoose";

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be positive"]
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"]
    },
    productImageUrl: {
      type: String,
      trim: true,
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true
    }
  },
  { timestamps: true }
);

export default model("Product", productSchema);
