import Store from "../models/store.model.js";
import { sendResponse } from "./response.js";

export const verifyStoreOwnership = async (req, res, next) => {
    try {
        const store = await Store.findById(req.params.storeId);
        if (!store) return sendResponse(res, 404, false, "Store Not Found.");
        if (store.owner.toString() !== req.user.userId) {
            return sendResponse(res, 403, false, "Not Authorized to access the Store.");
        }
        req.store = store; // attach store to request for controller use
        next();
    } catch (err) {
        next(err);
    }
};
