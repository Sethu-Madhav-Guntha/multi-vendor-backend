import { Router } from "express";
import {
  createOrder,
  editOrder,
  deleteOrder,
  getOrderById,
  listCustomerOrders,
  listStoreOrders,
  listVendorOrders,
  updateOrderStatus
} from "../controllers/order.controller.js";
import { isCustomer, isVendor } from "../middlewares/auth.middleware.js";

const router = Router();

// Customer routes
router.post("/customer/create", isCustomer, createOrder);
router.get("/customer", isCustomer, listCustomerOrders);
router.put("/customer/:orderId", isCustomer, editOrder);
router.delete("/customer/:orderId", isCustomer, deleteOrder);

// Vendor routes
router.get("/vendor", isVendor, listVendorOrders);
router.get("/store/:storeId", isVendor, listStoreOrders);
router.put("/vendor/:orderId", isVendor, updateOrderStatus);

// Both Customer and Vendor routes
router.get("/:orderId", getOrderById);

export default router;
