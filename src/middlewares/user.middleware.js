import { sendResponse } from "../utils/response.js";

export const validateSignup = (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return sendResponse(res, 400, false, "All fields are required.");
    }
    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return sendResponse(res, 400, false, "Email and Password are required.")
    }
    next();
};
