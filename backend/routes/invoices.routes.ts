import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
	createInvoice,
	getInvoices,
	getInvoiceById,
	updateInvoice,
	deleteInvoice,
} from "../controllers/invoice.controller.js";

export const invoiceRouter: Router = Router();

invoiceRouter.route("/").get(protect, getInvoices);
invoiceRouter.route("/").post(protect, createInvoice);
invoiceRouter
	.route("/:id")
	.get(protect, getInvoiceById)
	.delete(protect, deleteInvoice)
	.put(protect, updateInvoice);
