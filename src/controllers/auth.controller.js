import { registerUser, checkUserCredentials, tokenGeneration } from "../services/auth.services.js";
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

        const token = tokenGeneration(user._id, user.role);
        return sendResponse(res, 200, true, "Login Successful.", {
            redirect: "/",
            token,
            user: {
                userId: user._id,
                username: user.username,
                email: user.email,
                role: user.role
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
            const token = tokenGeneration(user._id, user.role);
            return sendResponse(res, 201, true, "User Registered Successfully.", {
                redirect: "/",
                token,
                user: {
                    userId: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        }
    } catch (err) {
        next(err);
    }
};
