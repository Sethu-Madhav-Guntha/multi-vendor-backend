import mongoose, { Schema } from "mongoose";

const storeSchema = new Schema({
  storeName: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User", // links to Seller user
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product" // will link later
    }
  ]
}, { timestamps: true });

export default mongoose.model("Store", storeSchema);
