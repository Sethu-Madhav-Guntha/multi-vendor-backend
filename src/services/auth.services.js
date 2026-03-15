import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const isUserRegistered = async (email) => {
    const foundUser = await User.findOne({ email });
    console.log(foundUser);
    return foundUser;
}

export const registerUser = async (userDetails) => {
    const generateSalt = await bcrypt.genSalt(10);
    const userHashedPassword = await bcrypt.hash(userDetails.password, generateSalt);
    userDetails.password = userHashedPassword;
    // console.log(userDetails.password);
    return await User.create(userDetails);
}

export const checkUserCredentials = async (credentials) => {
    const isUser = await isUserRegistered(credentials.email);
    if (!isUser) {
        return null;
    }
    const isPwdMatched = await bcrypt.compare(credentials.password, isUser.password);
    // console.log(isPwdMatched);
    return isPwdMatched;
} 