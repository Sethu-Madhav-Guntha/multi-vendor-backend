import Product from "../models/product.model.js";
import { sendResponse } from "../utils/response.js";

export const verifyProductOwnership = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId).populate("store");
    if (!product) return sendResponse(res, 404, false, "Product not found");
    
    if (product.store.owner.toString() !== req.user.userId) {
      return sendResponse(res, 403, false, "Unauthorized to access this product");
    }

    req.product = product;
    next();
  } catch (err) {
    next(err);
  }
};
