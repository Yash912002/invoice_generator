import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import {
  Loader2Icon,
  FileTextIcon,
  DollarSignIcon,
  PlusIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Button from "../../components/ui/Button";
import { AIInsightsCard } from "../../components/AIInsightsCard";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalPaid: 0,
    totalUnpaid: 0,
  });

  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES);
        const invoices = response.data.data;
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
            .sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate))
            .slice(0, 5)
        )
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
  };

  if (loading) {
    <div className="flex items-center justify-center h-96">
      <Loader2Icon className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  }

  return (
    <div className="">
      <div>
        <h2 className="">Dashboard</h2>
        <p className="">
          A quick overview of your business finance.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className=""
          >
            <div className="">
              <div
                className={`flex shrink-0 w-12 h-12
                  ${colorClasses[stat.color].bg} rounded-lg flex items-center justify-center`}
              >
                <stat.icon
                  className={`w-6 h-6 ${colorClasses[stat.color].text}`}
                />
              </div>

              <div className="">
                <div className="">
                  {stat.label}
                </div>
                <div className="">
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
      <div className="">
        <div className="">
          <h2 className="">
            Recent Invoices
          </h2>

          <Button variant="ghost" onClick={() => navigate("/invoices")}>
            View all
          </Button>
        </div>

        {recentInvoices.length > 0 ? (
          <div className="">
            <table className="">
              <thead className="">
                <tr>
                  <th className="">
                    Client
                  </th>
                  <th className="">
                    Amount
                  </th>
                  <th className="">
                    Status
                  </th>
                  <th className="">
                    Due date
                  </th>
                </tr>
              </thead>

              <tbody className="">
                {recentInvoices.map((invoice) => (
                  <tr
                    key={invoice._id}
                    className=""
                    onClick={() => navigate(`/invoices/${invoice._id}`)}
                  >
                    <td className="">
                      <div className="">
                        {invoice.billTo.clientName}
                      </div>
                      <div className="">
                        #{invoice.invoiceNumber}
                      </div>
                    </td>

                    <td className="">
                      ${invoice.total.toFixed(2)}
                    </td>

                    <td className="">
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

                    <td className="">
                      {moment(invoice.dueDate).format("MMM D, YYYY")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="">
            <div className="">
              <FileTextIcon className="" />
            </div>

            <h3 className="">
              No invoices yet
            </h3>

            <p className="">
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