import jwt from "jsonwebtoken";
import { sendResponse } from "../utils/response.js";
import User from "../models/user.model.js";

export const validateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return sendResponse(res, 401, false, "No Token Provided. Access Denied. Please Login.", {
                redirect: "/login"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userDetails = await User.findOne({ _id: decoded.userId });
        req.user = {
            userId: decoded.userId,
            username: userDetails.username,
            email: userDetails.email,
            role: decoded.role
        };

        next();
    } catch (err) {
        return sendResponse(res, 401, false, "Invalid or Expired Token. Please Login Again.", { redirect: "/login" });
    }
};

export const isVendor = (req, res, next) => {
    validateToken(req, res, (err) => {
        if (err) return next(err);
        if (req.user.role !== "Vendor") {
            return sendResponse(res, 403, false, "Accessible Only for Vendors.");
        }
        next();
    });
};

export const isCustomer = (req, res, next) => {
    validateToken(req, res, (err) => {
        if (err) return next(err);
        if (req.user.role !== "User") {
            return sendResponse(res, 403, false, "Accessible only for Customers.");
        }
        next();
    });
};