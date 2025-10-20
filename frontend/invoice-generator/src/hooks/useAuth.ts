import { createContext, useContext } from "react";

type AuthContextType = {
	user: object | null;
	loading: boolean;
	isAuthenticated: boolean;
	checkAuthStatus: () => void;
	login: (userData: object, token: string) => void;
	logout: () => void;
	updateUser: (updateUserData: object) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider.");
	}

	return context;
};
