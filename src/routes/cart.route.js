import { Router } from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  checkoutCart
} from "../controllers/cart.controller.js";

const router = Router();

// Cart endpoints
router.get("/", getCart);                  // Fetch cart list
router.post("/add", addToCart);            // Add product to cart
router.delete("/remove/:productId", removeFromCart); // Remove product
router.delete("/clear", clearCart);        // Clear cart
router.post("/checkout", checkoutCart);    // Checkout selected items

export default router;