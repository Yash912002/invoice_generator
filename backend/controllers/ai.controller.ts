import mongoose from "mongoose";
import { GoogleGenAI } from "@google/genai";
import InvoiceModel from "../models/Invoice.model.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import type { Response } from "express";

if (!process.env.GEMEINI_API_KEY) {
  throw new Error("Gemini Api key is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMEINI_API_KEY });

const aiModel = "gemini-2.5-flash";

export const parseInvoiceFromText = async (req: AuthRequest, res: Response) => {
  const { text }: { text: string } = req.body;

  if (!text || typeof text != "string") {
    res.status(400).json({
      success: false,
      message: "Valid 'text' is required in request body.",
    });
  }

  try {
    // const prompt = `
    // 	You are an expert invoice data extraction AI. Analyze the following text and extract the relevent information to create an invoice.
    // 	The output MUST be a valid JSON object.

    // 	The JSON object should have a following structure :-
    // 	{
    // 		"clientName": "string",
    // 		"email": "string (if available)",
    // 		"address": "string (if available)",
    // 		"items": [
    // 			{
    // 				"name": "string",
    // 				"quantity": "number",
    // 				"unitPrice": "number",
    // 			}
    // 		]
    // 	}

    // 	Here is the text to parse:
    // 	--- TEXT START ---
    // 	${text}
    // 	--- TEXT END ---
    // 	Extract the data and provide only JSON object.
    // `;

    const prompt = `
			You are an expert invoice data extraction AI. 
			Analyze the provided text and determine if it contains invoice-related information.
			If the text clearly describes an invoice (mentions things like "invoice", "client", 
			"amount", "item", "hours", "rate", "bill to", etc.), extract the data and return 
			a **valid JSON** object in the following structure:

			
			The JSON object should have a following structure :-
			{
				"clientName": "string",
				"email": "string (if available)",
				"address": "string (if available)",
				"items": [
					{
						"name": "string",
						"quantity": "number",
						"unitPrice": "number",
					}
				]
			}

			If the text is NOT invoice-related (e.g., greetings, random text, jokes, or 
			irrelevant content), return this exact JSON instead:

			{
				"error": "Input text does not contain invoice-related information."
			}

			Here is the text to parse:
			--- TEXT START ---
			${text}
			--- TEXT END ---
			Extract the data and provide only JSON object.
		`;

    const response = await ai.models.generateContent({
      model: aiModel,
      contents: prompt,
    });

    const responseText = response.text;

    if (!responseText || typeof responseText !== "string") {
      throw new Error(
        "responseText is undefined. Could not extract text from AI response.",
      );
    }

    // Clean and parse JSON safely
    const cleanedJSON = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedData = JSON.parse(cleanedJSON);

    if (
      parsedData.error ||
      !parsedData.items ||
      !Array.isArray(parsedData.items) ||
      parsedData.items.length === 0 ||
      !parsedData.clientName
    ) {
      return res.status(400).json({
        success: false,
        message: "Text is not a valid invoice or lacks sufficient information.",
      });
    }

    return res.status(200).json({
      success: true,
      data: parsedData,
    });
  } catch (error) {
    console.error("Error in parseInvoiceFromText ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to parse invoice data from text.",
    });
  }
};

export const generateReminderEmail = async (
  req: AuthRequest,
  res: Response,
) => {
  const { invoiceId }: { invoiceId: string } = req.body;

  if (!invoiceId || !mongoose.Types.ObjectId.isValid(invoiceId)) {
    return res.status(400).json({
      success: false,
      message: "Valid invoiceId is required",
    });
  }

  try {
    const invoice = await InvoiceModel.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    if (!invoice.billTo?.clientName || !invoice.dueDate || !invoice.total) {
      return res.status(400).json({
        success: false,
        message: "Invoice data incomplete for generating reminder email.",
      });
    }

    const prompt = `
			You are a professional and polite accounting assistant. Write a friendly reminder email to a client about an overdue or upcoming invoice payment.

			Use the following details to personalize the email:
			- Client name: ${invoice.billTo.clientName}
			- Invoice Number: ${invoice.invoiceNumber}
			- Amount due: ₹${invoice.total.toFixed(2)}
			- Due date: ${new Date(invoice.dueDate).toLocaleDateString()}

			The tone should be friendly but clear. Keep it concise. Start the email with "Subject:" 
		`;

    const response = await ai.models.generateContent({
      model: aiModel,
      contents: prompt,
    });

    const responseText = response.text;

    if (!responseText || typeof responseText !== "string") {
      throw new Error("AI failed to generate a valid reminder email.");
    }

    return res.status(200).json({
      success: true,
      message: "Reminder email generated successfully",
      reminderText: responseText,
    });
  } catch (error) {
    console.error("Error in getReminderEmail ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate reminder email.",
    });
  }
};

export const getDashboardSummary = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // const invoices = await InvoiceModel.find({ user: user.id });
    const invoices = await InvoiceModel.find({ user: user.id })
      .select("status total invoiceNumber createdAt")
      .lean();

    if (invoices.length === 0) {
      return res.status(200).json({
        success: true,
        data: { insights: ["No invoice data available to generate insights."] },
      });
    }

    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter((i) => i.status === "Paid");
    const unpaidInvoices = invoices.filter((i) => i.status === "Unpaid");

    const totalRevenue = paidInvoices.reduce((acc, i) => acc + i.total, 0);
    const totalOutstanding = unpaidInvoices.reduce(
      (acc, i) => acc + i.total,
      0,
    );
    const recentInvoices = invoices
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
      .map(
        (invoice) =>
          `Invoice ${invoice.invoiceNumber} for ₹${invoice.total.toFixed(2)} with status ${invoice.status}`,
      )
      .join(", ");

    const dataSummary = `
			- Total number of invoices: ${totalInvoices}
			- Total paid invoices: ${paidInvoices.length}
			- Total unpaid/pending invoices: ${unpaidInvoices.length}
			- Total revenue from paid invoices: ${totalRevenue.toFixed(2)}
			- Total outstanding amount from unpaid/pending invoices: ${totalOutstanding.toFixed(2)}
			- Recenet invoices (last 5): ${recentInvoices}
		`;

    const prompt = `
			You are a friendly and insightful financial analyst for a small business owner.
			Based on the following summary of their invoice data, provide 2-3 concise and actionable insights.
			Each insight should be short string in a JSON array.
			The insight should be encouraging and helpful. Do not just repeat the data.
			For example, if there is a high outstanding amount, suggest sending reminders. If revenue is high, be encouraging.

			Data Summary:
			${dataSummary}

			Return your response as a valid JSON object with a single key as "insights" which is an array of strings.
			Example format: { "insights": ["Your revenue is looking strong this month!", "You have 5 overdue invoices. Consider sending reminders to get paid faster."] } 
		`;

    const response = await ai.models.generateContent({
      model: aiModel,
      contents: prompt,
    });

    const responseText = response.text;

    if (!responseText || typeof responseText !== "string") {
      throw new Error("AI failed to generate summary");
    }

    // Clean and parse JSON safely
    const cleanedJSON = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedData = JSON.parse(cleanedJSON);

    return res.status(200).json({
      success: true,
      message: "Dashboard summary generated successfully.",
      data: parsedData,
    });
  } catch (error) {
    console.error("Error in getDashboardSummary ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get Dashboard summary.",
    });
  }
};
