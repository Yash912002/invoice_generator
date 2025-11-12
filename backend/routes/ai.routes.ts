import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
	parseInvoiceFromText,
	generateReminderEmail,
	getDashboardSummary,
} from "../controllers/ai.controller.js";

export const aiRouter: Router = Router();

aiRouter.route("/parse-text").post(protect, parseInvoiceFromText);
aiRouter.route("/generate-reminder").post(protect, generateReminderEmail);
aiRouter.route("/dashboard-summary").get(protect, getDashboardSummary);
