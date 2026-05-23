import { registerUser, checkUserCredentials, generateTokens } from "../services/auth.services.js";
import { sendResponse } from "../utils/response.js";

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { status, user } = await checkUserCredentials(email, password);

        if (status === "not_found") {
            return sendResponse(res, 401, false, "User Email Doesn't Exist. Please register.", { redirect: "/signup", prefillData: { email } });
        }

        if (status === "invalid_password") {
            return sendResponse(res, 401, false, "Invalid Credentials. Please try again.", { prefillData: { email } })
        }

        const { accessToken, refreshToken } = generateTokens(user._id, user.role);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "None",   // "None" + secure:true for prod
            secure: true,     // true in HTTPS
            maxAge: 60 * 60 * 1000 // 1 hour
        });
        return sendResponse(res, 200, true, `${user.username} LoggedIn.`, {
            redirect: "/",
            accessToken,
            user: {
                userId: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                gender: user.gender,
                profileImg: user.profileImg
            }
        });
    } catch (err) {
        next(err);
    }
};

export const signupUser = async (req, res, next) => {
    try {
        const { status, user } = await registerUser(req.body);

        if (status === "already_exists") {
            return sendResponse(res, 409, false, "User Email Account Exists. Please login.", {
                redirect: "/login",
                prefillData: { email: req.body.email }
            });
        }

        if (status === "success") {
            const { accessToken, refreshToken } = generateTokens(user._id, user.role);
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                sameSite: "None",   // "None" + secure:true for prod
                secure: true,     // true in HTTPS
                maxAge: 60 * 60 * 1000 // 1 hour
            });

            return sendResponse(res, 201, true, `${user.username} Registered as ${user.role}.`, {
                redirect: "/",
                accessToken,
                user: {
                    userId: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    gender: user.gender,
                    profileImg: user.profileImg
                }
            });
        }
    } catch (err) {
        next(err);
    }
};

export const getUserDetails = async (req, res, next) => {
    try {
        return sendResponse(res, 200, true, `Fetched ${req.user.username} Details Successfully.`, { user: req.user });
    } catch (err) {
        next(err);
    }
}

export const logoutUser = async (req, res, next) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "None",
            secure: true
        });
        return sendResponse(res, 200, true, "Logout Successful");
    } catch (err) {
        next(err);
    }
}