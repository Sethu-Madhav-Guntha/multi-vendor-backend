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
    productDiscount: {
      type: Number,
      required: true,
      min: [0, "Discount must be positive"],
      default: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"]
    },
    productImageUrl: {
      type: String,
      trim: true,
      set: function (value) {
        return value === "" ? undefined : value; // forces default if empty string
      },
      default: "https://static.vecteezy.com/ti/vetor-gratis/p1/10575261-product-icon-logo-vector-illustration-logistic-label-hands-holding-box-symbol-template-for-graphic-and-web-design-collection-vetor.jpg"
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true
    }
  },
  { timestamps: true }
);

productSchema.virtual("sellingPrice").get(function () {
  const productDiscount = this.productDiscount || 0;
  const storeDiscount = this.store?.storeDiscount || 0; // requires populate

  return this.price
    - (this.price * productDiscount / 100)
    - (this.price * storeDiscount / 100);
});

// Ensure virtuals show up in JSON responses
productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });

export default model("Product", productSchema);
