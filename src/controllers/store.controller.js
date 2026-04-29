import Store from "../models/store.model.js";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import { sendResponse } from "../utils/response.js";

export const createStore = async (req, res, next) => {
    try {
        if (req.user.role !== "Vendor") {
            return sendResponse(res, 403, false, "Only Vendors can create Store.");
        }

        const store = await Store.create({
            storeName: req.body.storeName,
            description: req.body.description,
            storeImg: req.body.storeImg,
            storeDiscount: req.body.storeDiscount,
            owner: req.user.userId
        });

        sendResponse(res, 201, true, `${store.storeName} Created by ${req.user.username}.`, { store });
    } catch (err) {
        next(err);
    }
};

export const updateStore = async (req, res, next) => {
    try {
        req.store.storeName = req.body.storeName || req.store.storeName;
        req.store.description = req.body.description || req.store.description;
        req.store.storeImg = req.body.storeImg || req.store.storeImg;
        req.store.storeDiscount = req.body.storeDiscount || req.store.storeDiscount;
        const updatedStore = await req.store.save();
        sendResponse(res, 200, true, `${req.store.storeName} Details Updated.`, { store: updatedStore });
    } catch (err) {
        next(err);
    }
};

export const deleteStore = async (req, res, next) => {
    try {
        await Product.deleteMany({ store: req.store._id });
        await Order.deleteMany({ store: req.store._id });

        const carts = await Cart.find().populate({
            path: "items.product", populate: {
                path: "store"
            }
        });

        for (const cart of carts) {
            cart.items = cart.items.filter(item => item.product && item.product.store?._id.toString() !== req.store._id.toString());
            await cart.save();
        }
        await req.store.deleteOne();
        res.status(204).end(); // no body for 204
    } catch (err) {
        next(err);
    }
};

// 4. Get Store by ID
export const getStoreById = async (req, res, next) => {
    try {
        const store = await Store.findById(req.params.storeId).populate({ path: "owner" }).populate({
            path: "products",
            populate: { path: "store" } // populate store inside each product
        });
        if (!store) return sendResponse(res, 404, false, `${req.params.storeId} Store Not Found.`);
        sendResponse(res, 200, true, `${store.storeName} Details Fetched.`, { store });
    } catch (err) {
        next(err);
    }
};

// 5. List Stores (Vendor’s own or all if Admin)
export const listStores = async (req, res, next) => {
    try {
        let query = {};
        if (req.user.role === "Vendor") query.owner = req.user.userId;
        const storesList = await Store.find(query);
        sendResponse(res, 200, true, `${req.user.username}'s Stores Fetched.`, { storesList });
    } catch (err) {
        next(err);
    }
};
