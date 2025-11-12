import { DollarSignIcon, FileTextIcon, Loader2Icon, PlusIcon } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AIInsightsCard } from '../../components/AIInsightsCard';
import Button from '../../components/ui/Button';
import { API_PATHS } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosInstance';
import type { IInvoice } from '../../types/invoice';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalPaid: 0,
    totalUnpaid: 0,
  });

  const [recentInvoices, setRecentInvoices] = useState<IInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES);
        const invoices: IInvoice[] = response.data.data;
        const totalInvoices = invoices.length;

        const totalPaid = invoices
          .filter((invoice) => invoice.status === "Paid")
          .reduce((acc, invoice) => acc + invoice.total, 0);

        const totalUnpaid = invoices
          .filter((invoice) => invoice.status !== "Paid")
          .reduce((acc, invoice) => acc + invoice.total, 0);

        setStats({ totalInvoices, totalPaid, totalUnpaid });

        setRecentInvoices(
          invoices
            .sort(
              (a, b) =>
                new Date(b.invoiceDate).getTime() -
                new Date(a.invoiceDate).getTime()
            )
            .slice(0, 5)
        );
      } catch (error) {
        console.error("Failed to fetch dashboard data. ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const statsData = [
    {
      icon: FileTextIcon,
      label: "Total Invoices",
      value: stats.totalInvoices,
      color: "blue",
    },
    {
      icon: DollarSignIcon,
      label: "Total paid",
      value: `${stats.totalPaid.toFixed(2)}`,
      color: "emerald",
    },
    {
      icon: DollarSignIcon,
      label: "Total Unpaid",
      value: `${stats.totalUnpaid.toFixed(2)}`,
      color: "red",
    },
  ];

  const colorClasses = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
    red: { bg: "bg-red-100", text: "text-red-600" },
  } as const;

  type StatColor = keyof typeof colorClasses;

  if (loading) {
    <div className="flex items-center justify-center h-96">
      <Loader2Icon className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="textxl font-semibold text-slate-900">
          Dashboard
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          A quick overview of your business finance.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-lg shadow-gray-50"
          >
            <div className="flex items-center">
              <div
                className={`flex shrink-0 w-12 h-12
                  ${colorClasses[stat.color as StatColor].bg} 
                  rounded-lg flex items-center justify-center`
                }
              >
                <stat.icon
                  className={`w-6 h-6 
                    ${colorClasses[stat.color as StatColor].text}`
                  }
                />
              </div>

              <div className="ml-4 min-w-0">
                <div className="text-sm font-medium text-slate-500 truncate">
                  {stat.label}
                </div>
                <div className="text-2xl font-bold text-slate-900 break-words">
                  {stat.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights card */}
      <AIInsightsCard />

      {/* Recent Invoices */}
      <div className="w-full bg-white border border-slate-200 rounded-lg shadow-sm shadow-gray-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Invoices
          </h2>

          <Button variant="ghost" onClick={() => navigate("/invoices")}>
            View all
          </Button>
        </div>

        {recentInvoices.length > 0 ? (
          <div className="w-[98vw] md:w-auto overflow-x-auto">
            <table className="w-full min-w-[600px] divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Due date
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-slate-200">
                {recentInvoices.map((invoice) => (
                  <tr
                    key={invoice._id}
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => navigate(`/invoices/${invoice._id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {invoice.billTo.clientName}
                      </div>
                      <div className="text-sm text-slate-500">
                        #{invoice.invoiceNumber}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                      ${invoice.total.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${invoice.status === "Paid" ?
                            "bg-emerald-100 text-emerald-800" :
                            invoice.status === "Pending" ?
                              "bg-amber-100 text-amber-800" :
                              "bg-red-100 text-red-800"
                          } 
                        `}
                      >
                        {invoice.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {moment(invoice.dueDate).format("MMM D, YYYY")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <FileTextIcon className="w-8 h-8 text-slate-400" />
            </div>

            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No invoices yet
            </h3>

            <p className="text-slate-500 mb-6 max-w-md">
              You haven't created any invoices yet. Get started by creating your first one.
            </p>

            <Button
              icon={PlusIcon}
              onClick={() => navigate("/invoices/new")}
            >
              Create Invoice
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard;