import { createContext, useContext } from "react";
import type { IUser } from "../context/AuthContext";

type AuthContextType = {
	user: IUser | null;
	loading: boolean;
	isAuthenticated: boolean;
	checkAuthStatus: () => void;
	login: (userData: IUser, token: string) => void;
	logout: () => void;
	updateUser: (updateUserData: IUser) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider.");
	}

	return context;
};
