import {
  AlertCircleIcon,
  EditIcon,
  FileTextIcon,
  Loader2Icon,
  MailIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  Trash2Icon
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CreateWithAiModal from '../../components/invoices/CreateWithAiModal';
import ReminderModal from '../../components/invoices/ReminderModal';
import Button from '../../components/ui/Button';
import { API_PATHS } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosInstance';
import type { IInvoice } from '../../types/invoice';

const AllInvoices = () => {

  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusChangeLoading, setStatusChangeLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES);
        setInvoices(
          response.data.sort(
            (a: IInvoice, b: IInvoice) =>
              new Date(b.invoiceDate).getTime() -
              new Date(a.invoiceDate).getTime()
          )
        );
      } catch (err) {
        setError('Failed to fetch invoices.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this invoice? "))

      try {
        await axiosInstance.delete(API_PATHS.INVOICE.DELETE_INVOICE(id));
        setInvoices(invoices.filter(invoice => invoice._id !== id));
      } catch (error) {
        setError("Failed to delete the invoice.");
        console.error(error);
      }
  };

  const handleStatusChange = async (invoice: IInvoice) => {
    setStatusChangeLoading(invoice._id);

    try {
      const newStatus = invoice.status === 'Paid' ? 'Unpaid' : "Paid";
      const updatedInvoice = { ...invoice, status: newStatus };

      const response = await axiosInstance.put(API_PATHS.INVOICE.UPDATE_INVOICE(invoice._id), updatedInvoice);

      setInvoices(invoices.map(inv => inv._id === invoice._id ? response.data : inv));
    } catch (error) {
      setError("Failed to update invoice status");
      console.error(error);
    } finally {
      setStatusChangeLoading(null);
    }
  };

  const handleOpenReminderModal = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setIsReminderModalOpen(true);
  };

  const filteredInvoices = useMemo(() => {
    return invoices
      .filter(invoice => statusFilter === 'All' || invoice.status === statusFilter)
      .filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.billTo.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [invoices, searchTerm, statusFilter]);

  if (loading) {
    return <div className="flex justify-center w-8 h-8 animate-spin text-blue-600 ">
      <Loader2Icon className="" />
    </div>
  }

  return (
    <div className="space-y-8">
      <CreateWithAiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        invoiceId={selectedInvoiceId}
      />

      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            All invoices
          </h1>

          <p className="text-sm text-slate-600 mt-1">
            Manage all your invoices in one place
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setIsAiModalOpen(true)}
            icon={SparklesIcon}
          >
            Create With AI
          </Button>

          <Button
            onClick={() => navigate("/invoices/new")}
            icon={PlusIcon}
          >
            Create Invoice
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border-red-200">
          <div className="flex items-start">
            <AlertCircleIcon className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 mb-1"> Error </h3>
              <p className="text-sm text-red-700">{error}</p>
            </div >
          </div >
        </div >
      )}

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-slate-400" />
              </div>

              <input
                type="text"
                placeholder="Search by invoice # or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full h-10 pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400'
              />
            </div>

            <div className="flex shrink-0">
              <select
                className="w-full sm:w-auto h-10 px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm text-slate-900"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          </div>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
              <FileTextIcon className="w-8 h-8 text-slate-200" />
            </div>

            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No invoices found
            </h3>
            <p className="text-slate-500 mb-6 max-w-md">
              Your search or filter criteria did not match any invoices.
            </p>

            {invoices.length === 0 && (
              <Button
                onClick={() => navigate("/invoices/new")}
                icon={PlusIcon}
              >
                Create first invoice
              </Button>
            )}
          </div>
        ) : (
          <div className="w-[98vw] md:w-auto overflow-x-auto">
            <table className="min-w-full divide-y ">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className='bg-white divide-y divide-slate-200'>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className='hover:bg-slate-50'>
                    <td
                      onClick={() => navigate(`/invoices/${invoice._id}`)}
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 cursor-pointer"
                    >
                      {invoice.invoiceNumber}
                    </td>

                    <td
                      onClick={() => navigate(`/invoices/${invoice._id}`)}
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 cursor-pointer"
                    >
                      {invoice.billTo.clientName}
                    </td>

                    <td
                      onClick={() => navigate(`/invoices/${invoice._id}`)}
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 cursor-pointer"
                    >
                      {invoice.total.toFixed(2)}
                    </td>

                    <td
                      onClick={() => navigate(`/invoices/${invoice._id}`)}
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 cursor-pointer"
                    >
                      {moment(invoice.dueDate).format("MMM DD YYYY")}
                    </td>

                    <td
                      onClick={() => navigate(`/invoices/${invoice._id}`)}
                      className="px-6 py-4 whitespace-nowrap text-sm"
                    >
                      <span
                        className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${invoice.status === "Paid" ? "bg-emerald-100 text-emerald-800" :
                            invoice.status === "Pending" ? "bg-amber-100 text-amber-800" :
                              "bg-red-100 text-red-800"
                          }
                        `}
                      >
                        {invoice.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                      <div className='flex items-center justify-end gap-2' onClick={e => e.stopPropagation()}>
                        <Button
                          size='small'
                          variant='secondary'
                          onClick={() => handleStatusChange(invoice)}
                          isLoading={statusChangeLoading === invoice._id}
                        >
                          {invoice.status === "Paid" ? "Mark Unpaid" : "Mark Paid"}
                        </Button>

                        <Button
                          size='small'
                          variant='ghost'
                          onClick={() => navigate(`/invoices/${invoice._id}`)}
                          isLoading={statusChangeLoading === invoice._id}
                        >
                          <EditIcon
                            className='w-4 h-4'
                          />
                        </Button>

                        <Button
                          size='small'
                          variant='ghost'
                          onClick={() => handleDelete(invoice._id)}
                          isLoading={statusChangeLoading === invoice._id}
                        >
                          <Trash2Icon
                            className='w-4 h-4 text-red-500'
                          />
                        </Button>

                        {invoice.status !== "Paid" && (
                          <Button
                            size='small'
                            variant='ghost'
                            onClick={() => handleOpenReminderModal(invoice._id)}
                            title='Generate Reminder'
                          >
                            <MailIcon className='w-4 h-4 text-blue-500' />
                          </Button>
                        )}

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
};

export default AllInvoices;