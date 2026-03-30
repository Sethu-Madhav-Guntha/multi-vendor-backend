import Store from "../models/store.model.js";
import { sendResponse } from "../utils/response.js";

export const createStore = async (req, res, next) => {
    try {
        // Only Seller role can create stores
        if (req.user.role !== "Vendor") {
            return sendResponse(res, 403, false, "Only Vendors can create Store.");
        }

        const store = await Store.create({
            storeName: req.body.storeName,
            description: req.body.description,
            owner: req.user.userId
        });

        sendResponse(res, 201, true, `Store By ID: ${store._id} Created Successfully.`, { store });
    } catch (err) {
        next(err);
    }
};

export const updateStore = async (req, res, next) => {
  try {
    req.store.storeName = req.body.storeName || req.store.storeName;
    req.store.description = req.body.description || req.store.description;
    const updatedStore = await req.store.save();
    sendResponse(res, 200, true, `Store By ID: ${req.store._id} Updated Successfully.`, { store: updatedStore });
  } catch (err) {
    next(err);
  }
};

export const deleteStore = async (req, res, next) => {
  try {
    await req.store.deleteOne();
    res.status(204).end(); // no body for 204
  } catch (err) {
    next(err);
  }
};

// 4. Get Store by ID
export const getStoreById = async (req, res, next) => {
    try {
        const store = await Store.findById(req.params.storeId);
        if (!store) return sendResponse(res, 404, false, "Store Not Found.");
        sendResponse(res, 200, true, `Store By ID: ${req.params.storeId} Fetched Successfully.`, { store });
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
        sendResponse(res, 200, true, "Vendor's All Stores Fetched Successfully.", { storesList });
    } catch (err) {
        next(err);
    }
};
