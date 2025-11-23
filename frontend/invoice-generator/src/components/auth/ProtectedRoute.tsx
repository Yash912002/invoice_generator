import { Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";

type Props = {
  children?: React.ReactNode
}

const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <DashboardLayout activeMenu="">
      {children ? children : <Outlet />}
    </DashboardLayout>
  )
}

export default ProtectedRoute;