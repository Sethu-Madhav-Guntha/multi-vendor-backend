import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const registerUser = async (userDetails) => {
  const existingUser = await User.findOne({ email: userDetails.email });
  if (existingUser) {
    return { status: "already_exists", user: null };
  }

  const generateSalt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userDetails.password, generateSalt);

  const newUser = await User.create({ ...userDetails, password: hashedPassword });
  return { status: "success", user: newUser };
};

export const checkUserCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    return { status: "not_found", user: null };
  }

  const isPwdMatched = await bcrypt.compare(password, user.password);
  if (!isPwdMatched) {
    return { status: "invalid_password", user: null };
  }

  return { status: "success", user };
};

export const tokenGeneration = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}
