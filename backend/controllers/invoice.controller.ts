import type { Response } from "express";
import InvoiceModel, { type IInvoice } from "../models/Invoice.model.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import mongoose from "mongoose";

export const createInvoice = async (req: AuthRequest, res: Response) => {
	try {
		const user = req.user;

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized access",
			});
		}

		const {
			invoiceNumber,
			invoiceDate,
			dueDate,
			billFrom,
			billTo,
			items,
			notes,
			paymentTerms,
		}: IInvoice = req.body;

		if (
			!invoiceNumber ||
			!invoiceDate ||
			!dueDate ||
			!billFrom ||
			!billTo ||
			!items ||
			!Array.isArray(items) ||
			items.length === 0
		) {
			return res.status(400).json({
				success: false,
				message: "Missing or invalid required fields",
			});
		}

		// Subtotal calculation
		let subtotal = 0;
		let taxTotal = 0;

		items.forEach((item) => {
			subtotal += item.unitPrice * item.quantity;
			taxTotal +=
				(item.unitPrice * item.quantity * (item.taxPercent || 0)) / 100;
		});

		const total = subtotal + taxTotal;

		const invoice: IInvoice = new InvoiceModel({
			user,
			invoiceNumber,
			invoiceDate,
			dueDate,
			billFrom,
			billTo,
			items,
			notes,
			paymentTerms,
			status,
			subtotal,
			taxTotal,
			total,
		});

		await invoice.save();

		return res.status(201).json({
			success: true,
			message: "Invoice created successfully",
			data: invoice,
		});
	} catch (error) {
		console.error("CreateInvoice error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error,
		});
	}
};

export const getInvoices = async (req: AuthRequest, res: Response) => {
	try {
		const invoices = await InvoiceModel.find({ user: req.user?._id }).populate(
			"user",
			"name email"
		);
		console.log(invoices);

		res.status(200).json({
			success: true,
			message: "Fetched all the invoices successfully",
			data: invoices,
		});
	} catch (error) {
		console.error("GetInvoices error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error,
		});
	}
};

export const getInvoiceById = async (req: AuthRequest, res: Response) => {
	try {
		const invoice = await InvoiceModel.findById(req.params.id).populate(
			"user",
			"name email"
		);

		if (!invoice) {
			return res.status(404).json({
				success: false,
				message: "Invoice not found",
			});
		}

		if (invoice.user !== req.user?._id) {
			return res.status(401).json({
				success: false,
				message: "Not Authorized",
			});
		}

		res.status(200).json({
			success: true,
			message: "Fetched the invoice successfully",
			data: invoice,
		});
	} catch (error) {
		console.error("GetInvoiceById error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error,
		});
	}
};

export const updateInvoice = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res
				.status(400)
				.json({ success: false, message: "Id is required" });
		}

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid invoice ID" });
		}

		const {
			invoiceNumber,
			invoiceDate,
			dueDate,
			billFrom,
			billTo,
			items,
			notes,
			paymentTerms,
			status,
		}: IInvoice = req.body;

		if (
			!invoiceNumber ||
			!invoiceDate ||
			!dueDate ||
			!billFrom ||
			!billTo ||
			!items ||
			!Array.isArray(items) ||
			items.length === 0
		) {
			return res.status(400).json({
				success: false,
				message: "Missing or invalid required fields",
			});
		}

		// Subtotal calculation
		let subtotal = 0;
		let taxTotal = 0;

		items.forEach((item) => {
			subtotal += item.unitPrice * item.quantity;
			taxTotal +=
				(item.unitPrice * item.quantity * (item.taxPercent || 0)) / 100;
		});

		const total = subtotal + taxTotal;

		const updatedInvoice = await InvoiceModel.findByIdAndUpdate(
			id,
			{
				invoiceNumber,
				invoiceDate,
				dueDate,
				billFrom,
				billTo,
				items,
				notes,
				paymentTerms,
				status,
				subtotal,
				taxTotal,
				total,
			},
			{ new: true }
		);

		if (!updatedInvoice) {
			return res.status(404).json({
				success: false,
				message: "Invoice not found",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Invoice updated successfully",
			data: updatedInvoice,
		});
	} catch (error) {
		console.error("UpdateInvoice error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

export const deleteInvoice = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res
				.status(400)
				.json({ success: false, message: "Id is required" });
		}

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid invoice ID" });
		}

		const deletedInvoice = await InvoiceModel.findByIdAndDelete(id);

		if (!deletedInvoice) {
			return res.status(404).json({
				success: false,
				message: "Invoice not found",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Invoice deleted successfully",
		});
	} catch (error) {
		console.error("DeleteInvoice error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error,
		});
	}
};
