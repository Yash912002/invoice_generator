import "dotenv/config";
import express, { type Application } from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";
import { authRouter } from "./routes/auth.routes.js";
import { invoiceRouter } from "./routes/invoices.routes.js";
import { aiRouter } from "./routes/ai.routes.js";

const app: Application = express();

// Middlewares
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

// Database Connection
connectDB();

app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/invoices", invoiceRouter);
app.use("/api/ai", aiRouter);

// Start the server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
	console.info("Application started on port ", PORT);
});
