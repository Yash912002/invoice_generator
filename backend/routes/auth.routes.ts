import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
	registerUser,
	loginUser,
	getMe,
	updateUserProfile,
} from "../controllers/auth.controller.js";

export const authRouter: Router = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.route("/me").get(protect, getMe).put(protect, updateUserProfile);
