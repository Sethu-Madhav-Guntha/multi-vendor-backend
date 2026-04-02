import { Router } from "express";
import {
  createOrder,
  editOrder,
  deleteOrder,
  getOrderById,
  listCustomerOrders,
  listVendorStoreOrders,
  listVendorOrders,
  updateOrderStatus
} from "../controllers/order.controller.js";
import { isCustomer, isVendor } from "../middlewares/auth.middleware.js";

const router = Router();

// Customer routes
router.post("/create", isCustomer, createOrder);
router.put("/edit/:orderId", isCustomer, editOrder);
router.delete("/delete/:orderId", isCustomer, deleteOrder);
router.get("/:orderId", isCustomer, getOrderById);
router.get("/", isCustomer, listCustomerOrders);

// Vendor routes
router.get("/vendor/store/:storeId", isVendor, listVendorStoreOrders);
router.get("/vendor", isVendor, listVendorOrders);
router.put("/status/:orderId", isVendor, updateOrderStatus);

export default router;
