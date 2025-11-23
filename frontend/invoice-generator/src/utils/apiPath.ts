export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const API_PATHS = {
	AUTH: {
		REGISTER: "/auth/register", // Signup
		LOGIN: "/auth/login", // Authenticate user & return JWT token
		GET_PROFILE: "/auth/me", // (GET) Get logged-in user details
		UPDATE_PROFILE: "/auth/me", // (PUT) update profile details
	},

	INVOICE: {
		CREATE: "/invoices/", // (POST)
		GET_ALL_INVOICES: "/invoices/",
		GET_INVOICE_BY_ID: (id: string) => `/invoices/${id}`,
		UPDATE_INVOICE: (id: string) => `/invoices/${id}`,
		DELETE_INVOICE: (id: string) => `/invoices/${id}`,
	},

	AI: {
		PARSE_INVOICE_TEXT: "/ai/parse-text",
		GENERATE_REMINDER: "/ai/generate-reminder",
		GET_DASHBOARD_SUMMARY: "/ai/dashboard-summary",
	},
};
