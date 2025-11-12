interface IItem {
  name: string;
  quantity: number;
  unitPrice: number;
  taxPercent: number;
  total?: number;
}

export interface IInvoice {
  _id: string;
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
  items: Array<IItem>;
  notes?: string;
  paymentTerms: string;
  status: string;
  subtotal: number;
  taxTotal: number;
  total: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateInvoiceSchema {
  existingInvoice: IInvoice;
  onSave: (formData: IInvoice) => void
}