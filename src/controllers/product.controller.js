import Product from "../models/product.model.js";
import Store from "../models/store.model.js";
import { sendResponse } from "../utils/response.js";

// Create Product
export const createProduct = async (req, res, next) => {
  try {
    const store = await Store.findById(req.body.storeId);
    if (!store || store.owner.toString() !== req.user.userId) {
      return sendResponse(res, 403, false, `Unauthorized to add product to ${store.storeName} store.`);
    }

    const product = await Product.create({
      productName: req.body.productName,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      productImageUrl: req.body.productImageUrl, // ✅ new field
      productDiscount: req.body.productDiscount,
      store: store._id
    });

    // ✅ Update store's products array
    await Store.findByIdAndUpdate(
      store._id,
      { $push: { products: product._id } },
      { returnDocument: "after" }
    );

    sendResponse(res, 201, true, `${product.productName} Product added at ${store.storeName} by ${req.user.username}.`, { product });
  } catch (err) {
    next(err);
  }
};

// Update Product
export const updateProduct = async (req, res, next) => {
  try {
    req.product.productName = req.body.productName || req.product.productName;
    req.product.description = req.body.description || req.product.description;
    req.product.price = req.body.price || req.product.price;
    req.product.quantity = req.body.quantity || req.product.quantity;
    req.product.productImageUrl = req.body.productImageUrl || req.product.productImageUrl;
    req.product.productDiscount = req.body.productDiscount || req.product.productDiscount;

    const updatedProduct = await req.product.save();
    sendResponse(res, 200, true, `${req.product.productName} Product Updated by ${req.user.username}.`, { product: updatedProduct });
  } catch (err) {
    next(err);
  }
};

// Delete Product
export const deleteProduct = async (req, res, next) => {
  try {
    // ✅ Remove product reference from store
    await Store.findByIdAndUpdate(
      req.product.store,
      { $pull: { products: req.product._id } },
      { returnDocument: "after" }
    );

    // ✅ Delete the product itself
    await req.product.deleteOne();
    res.status(204).end(); // no body for 204
  } catch (err) {
    next(err);
  }
};

// Get Product by ID
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId).populate("store");
    if (!product) return sendResponse(res, 404, false, `${req.params.productId} Product not found.`);
    sendResponse(res, 200, true, `${product.productName} Product Details Fetched.`, { product });
  } catch (err) {
    next(err);
  }
};

// List Products (public)
export const listProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate({ path: "store", populate: { path: "owner" } });
    sendResponse(res, 200, true, "All Products Fetched.", { products });
  } catch (err) {
    next(err);
  }
};
