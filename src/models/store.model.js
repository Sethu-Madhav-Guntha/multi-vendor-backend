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
  storeImg: {
    type: String,
    default: "https://fitsmallbusiness.com/wp-content/uploads/2022/12/Storefront_A2_Icon-300x300.jpg",
    set: function (value) {
      return value === "" ? undefined : value; // forces default if empty string
    }
  },
  storeDiscount: {
    type: Number,
    required: true,
    min: [0, "Discount must be positive"],
    default: 0,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
}, { timestamps: true });

export default mongoose.model("Store", storeSchema);
