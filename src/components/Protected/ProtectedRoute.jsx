import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/store";
export default function ProtectedRoute({feature, action, children }) {
    const { user } = useAuth();



  if (!user) return <Navigate to="/" replace />;

  if(user.role==="admin") return children;
  // Find feature access
  const featureAccess = user?.access?.find(a => a.feature === feature);

  // If feature not allowed → deny access
  if (!featureAccess) {
    return <Navigate to="/dashboard/unauthorized" replace />;
  }

  // If specific action needed (0,1,2,3)
  if (action !== undefined) {
    if (!featureAccess.permission.includes(action)) {
      return <Navigate to="/dashboard/unauthorized" replace />;
    }
  }

  return children;
}
