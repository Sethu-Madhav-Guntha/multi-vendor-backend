export const sendResponse = (res, statusCode, success, message, extra = {}) => {
  return res.status(statusCode).json({
    success,
    message,
    ...extra
  });
};
