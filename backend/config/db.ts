import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URL || "");
		console.info("Successfully connected to MongoDB");
	} catch (error) {
		console.error("Error connecting to database ", error);
		process.exit(1);
	}
};
