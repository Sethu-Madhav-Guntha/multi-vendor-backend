import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Store from "../models/store.model.js"; // assuming you have a Store model
import { sendResponse } from "../utils/response.js";

// Customer: Create Order (split per store)
export const createOrder = async (req, res, next) => {
  try {
    const items = req.body;
    if (!items || items.length === 0) return sendResponse(res, 400, false, "No items provided to Order.");

    // Group items by store
    const storeGroups = {};
    for (const { productId, quantity, sellingPrice } of items) {
      const product = await Product.findById(productId);
      if (!product) return sendResponse(res, 404, false, `${productId} Product not found`);
      if (product.quantity < quantity) return sendResponse(res, 400, false, `${product.productName}'s Stock is Insufficient.`);

      product.quantity -= quantity;
      await product.save();

      if (!storeGroups[product.store]) storeGroups[product.store] = [];
      storeGroups[product.store].push({ product, quantity, sellingPrice });
    }

    // Create separate orders per store
    const createdOrders = [];
    for (const storeId of Object.keys(storeGroups)) {
      const orderItems = storeGroups[storeId].map(i => ({
        product: i.product._id,
        quantity: i.quantity,
        price: i.product.price,
        sellingPrice: i.sellingPrice
      }));

      const totalAmount = orderItems.reduce((sum, i) => sum + i.sellingPrice * i.quantity, 0);

      const order = await Order.create({
        user: req.user.userId,
        items: orderItems,
        store: storeId,
        totalAmount,
        status: "Pending"
      });
      createdOrders.push(order);
    }

    sendResponse(res, 201, true, "Orders Placed.", { orders: createdOrders });
  } catch (err) {
    next(err);
  }
};

// Customer: Edit Order (Pending only)
export const editOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, user: req.user.userId });
    if (!order) return sendResponse(res, 404, false, `${req.params.orderId} Order not found`);
    if (order.status !== "Pending") return sendResponse(res, 400, false, "Only Pending orders can be edited");

    const { items } = req.body;
    if (!items || items.length === 0) {
      return sendResponse(res, 400, false, "No items provided to place order.");
    }

    let updatedItems = [];
    let totalAmount = 0;

    for (const { productId, quantity, sellingPrice } of items) {
      const product = await Product.findById(productId);
      if (!product) return sendResponse(res, 404, false, `Product ${productId} not found`);
      if (product.quantity < quantity) {
        return sendResponse(res, 400, false, `${product.productName}'s Stock is Insufficient.`);
      }

      updatedItems.push({
        product: product._id,
        quantity,
        sellingPrice
      });

      totalAmount += sellingPrice * quantity;
    }

    order.items = updatedItems;
    order.totalAmount = totalAmount;

    await order.save();
    sendResponse(res, 200, true, `${req.params.orderId} Order Updated.`, { order });
  } catch (err) {
    next(err);
  }
};

// Customer: Delete Order (Pending only)
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, user: req.user.userId });
    if (!order) return sendResponse(res, 404, false, `${req.params.orderId} Order not found.`);
    if (order.status !== "Pending") return sendResponse(res, 400, false, "Only Pending orders can be deleted.");

    await order.deleteOne();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// Customer & Vendor: Get Order by ID
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, user: req.user.userId }).populate({ path: "items.product", populate: { path: "store", populate: { path: "owner" } } });
    if (!order) return sendResponse(res, 404, false, `${req.params.orderId} Order not found.`);

    sendResponse(res, 200, true, `${req.params.orderId} Order fetched.`, { order });
  } catch (err) {
    next(err);
  }
};

// Customer: List Orders
export const listCustomerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).populate({ path: "items.product", populate: { path: "store", populate: { path: "owner" } } });
    sendResponse(res, 200, true, `${req.user.username} Orders fetched.`, { orders });
  } catch (err) {
    next(err);
  }
};

// Vendor: List Store Orders
export const listStoreOrders = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const orders = await Order.find({ store: storeId }).populate("items.product").populate("store").populate("user");
    sendResponse(res, 200, true, `${orders[0].store.storeName} Store orders fetched.`, { orders });
  } catch (err) {
    next(err);
  }
};

// Vendor: List All Orders across Vendor's stores
export const listVendorOrders = async (req, res, next) => {
  try {
    const stores = await Store.find({ owner: req.user.userId }).select("_id");
    const storeIds = stores.map(s => s._id);

    const orders = await Order.find({ store: { $in: storeIds } }).populate("items.product").populate("store").populate("user");
    sendResponse(res, 200, true, `${req.user.username}'s all stores orders fetched.`, { orders });
  } catch (err) {
    next(err);
  }
};

// Vendor: Update Order Status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return sendResponse(res, 404, false, `${req.params.orderId} Order not found.`);

    order.status = status;
    await order.save();

    sendResponse(res, 200, true, `${req.params.orderId} Order status updated successfully`, { order });
  } catch (err) {
    next(err);
  }
};
