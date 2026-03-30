import jwt from "jsonwebtoken";
import { sendResponse } from "../utils/response.js";

export const validateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return sendResponse(res, 401, false, "No Token Provided. Access Denied. Please Login.", {
                redirect: "/login"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            userId: decoded.userId,
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
