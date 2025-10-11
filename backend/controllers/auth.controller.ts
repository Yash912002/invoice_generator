import jwt from "jsonwebtoken";
import UserModel from "../models/User.model.js";
import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

// Helper: Generate a JWT token
const generateToken = (id: string) => {
	return jwt.sign({ id }, process.env.JWT_SECRET!, {
		expiresIn: "7d",
	});
};

export const registerUser = async (req: Request, res: Response) => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res
				.status(400)
				.json({ sucess: false, message: "All fields are required" });
		}

		const existingUser = await UserModel.findOne({ email });

		if (existingUser) {
			return res
				.status(400)
				.json({ sucess: false, message: "Email already in use" });
		}

		const user = await UserModel.create({ name, email, password });

		const token = generateToken(user._id.toString());

		return res.status(201).json({
			success: true,
			data: {
				_id: user._id,
				name: user.name,
				email: user.email,
				token,
			},
		});
	} catch (error) {
		console.error("Register error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error,
		});
	}
};

export const loginUser = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ sucess: false, message: "Email and password are required" });
		}

		const user = await UserModel.findOne({ email }).select("+password");

		if (!user) {
			return res
				.status(401)
				.json({ sucess: false, message: "Invalid email or password" });
		}

		const isPasswordCorrect = await user.matchPassword(password);

		if (!isPasswordCorrect) {
			return res
				.status(401)
				.json({ sucess: false, message: "Invalid email or password" });
		}

		const token = generateToken(user._id.toString());

		return res.status(200).json({
			success: true,
			data: {
				_id: user._id,
				name: user.name,
				email: user.email,
				businessName: user.businessName || "",
				address: user.address || "",
				phone: user.phone || "",
				token,
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error,
		});
	}
};

export const getMe = async (req: AuthRequest, res: Response) => {
	try {
		if (!req.user) {
			return res
				.status(401)
				.json({ sucess: false, message: "Unauthorized: user not found" });
		}

		const user = req.user;

		return res.status(200).json({
			success: true,
			data: {
				_id: user._id,
				name: user.name,
				email: user.email,
				businessName: user.businessName || "",
				address: user.address || "",
				phone: user.phone || "",
			},
		});
	} catch (error) {
		console.error("GetMe error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error,
		});
	}
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
	try {
		if (!req.user) {
			return res
				.status(401)
				.json({ sucess: false, message: "Unauthorized: user not found" });
		}

		// Authenticated user from protect middleware
		const user = req.user;

		user.name = req.body.name || user.name;
		// user.email = req.body.email || user.email;
		user.businessName = req.body.businessName || user.businessName;
		user.address = req.body.address || user.address;
		user.phone = req.body.phone || user.phone;

		const updatedUser = await user.save();

		return res.status(200).json({
			success: true,
			data: {
				_id: updatedUser._id,
				name: updatedUser.name,
				email: updatedUser.email,
				businessName: updatedUser.businessName || "",
				address: updatedUser.address || "",
				phone: updatedUser.phone || "",
			},
		});
	} catch (error) {
		console.error("UpdateUserProfile error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error,
		});
	}
};
