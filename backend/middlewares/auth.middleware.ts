import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import UserModel, { type IUser } from "../models/User.model.js";

export interface AuthRequest extends Request {
	user?: IUser | null;
}

export const protect = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer")) {
			return res.status(401).json({ message: "No token provided" });
		}

		const token = authHeader.split(" ")[1];

		if (!token) {
			return res.status(401).json({ message: "Invalid token format" });
		}

		if (!process.env.JWT_SECRET) {
			return res.status(401).json({ message: "JWT_SECRET is not defined" });
		}

		const decodedToken = jwt.verify(
			token,
			process.env.JWT_SECRET
		) as JwtPayload;

		if (!decodedToken || !decodedToken.id) {
			return res.status(401).json({ message: "Invalid token payload" });
		}

		const user = await UserModel.findById(decodedToken.id).select("-password");

		if (!user) {
			return res.status(401).json({ message: "User not found" });
		}

		req.user = user;
		next();
	} catch (error) {
		console.error("Auth error:", error);
		return res
			.status(401)
			.json({ message: "Unauthorized: invalid or expired token" });
	}
};
