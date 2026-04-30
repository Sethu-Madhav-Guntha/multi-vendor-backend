import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { sendResponse } from "../utils/response.js";

// Utility: calculate total
const calculateTotal = (items) =>
    items.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);

// Get Cart
export const getCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user.userId }).populate({
            path: "items.product",
            populate: { path: "store", populate: { path: "owner" } }
        });
        if (!cart) return sendResponse(res, 200, true, `${req.user.username}'s Cart is empty`, { items: [] });

        const totalAmount = calculateTotal(cart.items);
        sendResponse(res, 200, true, `${req.user.username}'s Cart Fetched.`, { cart, totalAmount });
    } catch (err) {
        next(err);
    }
};

// Add to Cart
export const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity, sellingPrice } = req.body;
        const product = await Product.findById(productId);
        if (!product) return sendResponse(res, 404, false, `${productId} Product not Found.`);
        if (product.quantity < quantity) return sendResponse(res, 400, false, `${product.productName}'s Stock is Insufficient.`);

        let cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) cart = new Cart({ user: req.user.userId, items: [] });

        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity, sellingPrice });
        }

        await cart.save();
        sendResponse(res, 200, true, `${product.productName} is added to Cart.`, { cart });
    } catch (err) {
        next(err);
    }
};

// Remove or Decrement Cart Item
export const removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { removeAll } = req.body; // ✅ optional flag

        const cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) return sendResponse(res, 200, true, `${req.user.username}'s Cart is Empty.`, { items: [] });

        const item = cart.items.find(i => i.product.toString() === productId);
        if (!item) return sendResponse(res, 404, false, `${productId} Product not found in Cart.`);
        if (removeAll) {
            cart.items = cart.items.filter(i => i.product.toString() !== productId);
        } else {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                cart.items = cart.items.filter(i => i.product.toString() !== productId);
            }
        }

        await cart.save();
        sendResponse(res, 200, true, `${req.user.username}'s Cart updated.`, { cart });
    } catch (err) {
        next(err);
    }
};

// Clear Cart
export const clearCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user.userId });
        if (!cart) return sendResponse(res, 200, true, `${req.user.username}'s Cart is already Empty.`, { items: [] });

        cart.items = [];
        await cart.save();

        sendResponse(res, 200, true, `${req.user.username}'s Cart Cleared.`);
    } catch (err) {
        next(err);
    }
};