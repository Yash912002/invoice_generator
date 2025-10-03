import { Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

type Props = {
  children?: React.ReactNode
}

const ProtectedRoute = ({ children }: Props) => {
  const isAuthenticated = true;
  const isLoading = false;

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <DashboardLayout>
      {children ? children : <Outlet />}
    </DashboardLayout>
  )
}

export default ProtectedRoute;