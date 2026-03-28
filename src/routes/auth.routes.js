import { Router } from "express";
import {loginUser, signupUser} from "../controllers/auth.controller.js";
import { validateLogin, validateSignup } from "../middlewares/user.middleware.js";

const router = Router();

router.post("/login", validateLogin, loginUser);
router.post("/signup", validateSignup, signupUser);

export default router;