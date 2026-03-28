export function errorHandler(err, req, res, next) {
  // Mongoose validation errors (e.g., regex, required, minlength)
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      errorType: "ValidationError",
      message: messages.join(", ")
    });
  }

  // MongoDB duplicate key error (e.g., unique email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      errorType: "DuplicateKeyError",
      message: `${field} already exists. Please use a different ${field}.`
    });
  }

  // Fallback for other errors
  return res.status(500).json({
    success: false,
    errorType: "ServerError",
    message: "Something went wrong. Please try again later."
  });
};
