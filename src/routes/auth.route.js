import { Router } from "express";
import { getUserDetails, loginUser, signupUser, logoutUser } from "../controllers/auth.controller.js";
import { validateLogin, validateSignup } from "../middlewares/user.middleware.js";
import { validateToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", validateLogin, loginUser);
router.post("/signup", validateSignup, signupUser);
router.get("/user", validateToken, getUserDetails);
router.post("/logout", logoutUser);

export default router;