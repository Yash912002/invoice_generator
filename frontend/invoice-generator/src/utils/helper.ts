export const validateEmail = (email: string) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!email) return "Email is required";
	if (!emailRegex.test(email)) return "Please enter a valid email address";
	return "";
};

export const validatePassword = (password: string) => {
	if (!password) return "Password is required";
	if (password.length < 6) return "Password must be atleast 6 characters";

	// Minimum 8 characters, at least one uppercase, one lowercase, one number, and one special character
	// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

	// if (!passwordRegex.test(password)) {
	//   return "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character";
	// }

	return "";
};
