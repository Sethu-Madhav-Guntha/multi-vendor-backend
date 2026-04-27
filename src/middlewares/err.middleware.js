import { sendResponse } from "../utils/response.js";

export function errorHandler(err, req, res, next) {
  // Mongoose validation errors (e.g., regex, required, minlength)
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(val => val.message);
    return sendResponse(res, 400, false, messages.join(`, ${err.message}`), ...err);
  }

  // MongoDB duplicate key error (e.g., unique email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendResponse(res, 409, false, `${field} already exists. Please use a different ${field}. ${err.message}`, ...err);
  }

  // Fallback for other errors
  return sendResponse(res, 500, false, `${err.message}`, ...err);
};
