import { Router } from "express";
import {
    createStore,
    updateStore,
    deleteStore,
    getStoreById,
    listStores
} from "../controllers/store.controller.js";
import { verifyStoreOwnership } from "../utils/authorizeStore.js";

const router = Router();

router.post("/create", createStore);
router.put("/:storeId", verifyStoreOwnership, updateStore);
router.delete("/:storeId", verifyStoreOwnership, deleteStore);
router.get("/:storeId", verifyStoreOwnership, getStoreById);
router.get("/", listStores);

export default router;
