import { Document, model, Schema } from "mongoose";
import type { IUser } from "./User.model.js";

export interface IItem extends Document {
  name: string;
  quantity: number;
  unitPrice: number;
  taxPercent: number;
  total: number;
}

const itemSchema = new Schema<IItem>({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  taxPercent: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
});

export interface IInvoice extends Document {
  user: IUser;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  billFrom: {
    businessName: string;
    email: string;
    address: string;
    phone: string;
  };
  billTo: {
    clientName: string;
    email: string;
    address: string;
    phone: string;
  };
  items: IItem[];
  notes?: string;
  paymentTerms: string;
  status: string;
  subtotal: number;
  taxTotal: number;
  total: number;
  createdAt: Date;
  updatedAt?: Date;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    billFrom: {
      businessName: String,
      email: String,
      address: String,
      phone: String,
    },
    billTo: {
      clientName: String,
      email: String,
      address: String,
      phone: String,
    },
    items: [itemSchema],
    notes: {
      type: String,
    },
    paymentTerms: {
      type: String,
      default: "Net 15",
    },
    status: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
    },
    subtotal: Number,
    taxTotal: Number,
    total: Number,
  },
  { timestamps: true },
);

export default model<IInvoice>("Invoice", invoiceSchema);
