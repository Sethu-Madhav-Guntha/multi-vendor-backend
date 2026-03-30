import { Router } from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  listProducts
} from "../controllers/product.controller.js";
import { isVendor } from "../middlewares/auth.middleware.js";
import { verifyProductOwnership } from "../utils/authorizeProduct.js";

const router = Router();

// Specific Vendor-only can create, update, delete products
router.post("/create", isVendor, createProduct);
router.put("/:productId", isVendor, verifyProductOwnership, updateProduct);
router.delete("/:productId", isVendor, verifyProductOwnership, deleteProduct);

// Public fetch
router.get("/:productId", getProductById);
router.get("/", listProducts);

export default router;
