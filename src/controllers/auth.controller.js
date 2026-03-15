import { isUserRegistered, registerUser, checkUserCredentials } from "../services/auth.services.js";

export const loginUser = async (req, res) => {
    // console.log("At login controller: \n", req.body);
    const isExistingUser = await isUserRegistered(req.body.email);
    if (!isExistingUser) {
        return res
            .status(401)
            .json({
                success: false,
                message: "User Doesn't Exists.",
                redirect: "/signup",
                prefillData: {
                    email: req.body.email
                }
            });
    }
    const isValidCredentials = await checkUserCredentials(req.body);
    if (!isValidCredentials) {
        return res
            .status(401)
            .json({
                success: false,
                message: "Invalid credentials"
            });
    }
    res
    .status(200)
    .json({
    success: true,
    message: "Login successful",
    user: {
      id: isExistingUser._id,
      username: isExistingUser.username,
      email: isExistingUser.email,
      role: isExistingUser.role
    }
  });
}

export const signupUser = async (req, res) => {
    // console.log("At Signup controller: \n", req.body);
    const isExistingUser = await isUserRegistered(req.body.email);
    if (isExistingUser) {
        return res
            .status(409)
            .json({
                success: false,
                message: "User Account Exists.",
                redirect: "/login",
                prefillData: {
                    email: req.body.email
                }
            });
    }
    const result = await registerUser(req.body);
    // console.log(result);
    return res
        .status(201)
        .json({
            success: true,
            message: "User Registered Successfully.",
            redirect: "/",
            user: {
                userId: result._id,
                username: result.username,
                email: result.email,
                role: result.role
            }
        });
}