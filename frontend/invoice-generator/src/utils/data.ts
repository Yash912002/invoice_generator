import {
	BarChart2Icon,
	FileTextIcon,
	LayoutDashboardIcon,
	MailIcon,
	PlusIcon,
	SparklesIcon,
	UserIcon,
} from "lucide-react";

export const FEATURES = [
	{
		icon: SparklesIcon,
		title: "AI Invoice creation",
		description:
			"Paste any email, text or receipt, and let our AI generate a complete, professional invoice for you.",
	},
	{
		icon: BarChart2Icon,
		title: "AI-powered Dashboard",
		description:
			"Get smart, actionable insights about your business finances, generated automatically by our AI analyst",
	},
	{
		icon: MailIcon,
		title: "Smart Reminders",
		description:
			"Automatically generate polite and effective payment reminder emails for overdue invoices with a single click.",
	},
	{
		icon: FileTextIcon,
		title: "Easy Invoice Management",
		description:
			"Easily manage all your invoices, track payments and send reminders for overdue payments.",
	},
];

export const TESTOMONIALS = [
	{
		quote:
			"This app saved me hours of work. I can now send and create invoices in minutes.",
		author: "Jane doe",
		title: "Freelance Designer",
		avatar: "https://placehold.co/100x100/000000/ffffff?text=JD",
	},
	{
		quote:
			"The best invoicing app I have ever used. Simple, intuitive and powerful.",
		author: "John Smith",
		title: "Small business owner",
		avatar: "https://placehold.co/100x100/000000/ffffff?text=JS",
	},
	{
		quote:
			"I love the dashboard and reporting feature. It helps me keep track of my financials.",
		author: "Peter Johnes",
		title: "Consultant",
		avatar: "https://placehold.co/100x100/000000/ffffff?text=PJ",
	},
];

export const FAQS = [
	{
		question: "How does the AI invoice creation work?",
		answer:
			"Simply upload or paste any text that contains billing details—like an email, message, or receipt—and our AI automatically extracts and structures it into a professional invoice.",
	},
	{
		question: "Can I edit the generated invoice before downloading?",
		answer:
			"Yes, you can review and modify all fields such as client details, items, and totals before finalizing or downloading the invoice.",
	},
	{
		question: "Which file formats are supported for download?",
		answer:
			"You can download invoices as PDF or PNG. More formats like DOCX and CSV are coming soon.",
	},
	{
		question: "Is my data stored or shared?",
		answer:
			"No, your data is processed securely and never stored or shared. All invoice generation happens in a privacy-first environment.",
	},
	{
		question: "Can I generate invoices in different currencies or languages?",
		answer:
			"Yes, you can customize currency symbols, tax formats, and even generate invoices in multiple languages.",
	},
	{
		question: "Do I need to create an account to use the tool?",
		answer:
			"No account is required for basic usage. However, creating an account lets you save, track, and manage your invoices easily.",
	},
	{
		question: "Can I integrate this with my existing system?",
		answer:
			"Yes, our API allows easy integration with your CRM, ERP, or accounting software for automated invoice generation.",
	},
];

// Navigation items config
export const NAVIGATION_MENU = [
	{ id: "dashboard", name: "Dashboard", icon: LayoutDashboardIcon },
	{ id: "invoices", name: "Invoices", icon: FileTextIcon },
	{ id: "invoices/new", name: "Create Invoice", icon: PlusIcon },
	{ id: "profile", name: "Profile", icon: UserIcon },
];
