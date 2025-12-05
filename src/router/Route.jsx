import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/Login";
import DashboardLayout from "../Layouts/DashboardLayout";
import { useAuth } from "../context/store";
import Dashboard from "../components/Dashboard";
import Team from "../components/Users/Team";
import CreateEmployee from "../components/Users/CreateEmployee";
import EditEmployee from "../components/Users/EditEmployee";
import Unauthorized from "../components/Protected/Unauthorised";
import ProtectedRoute from "../components/Protected/ProtectedRoute";
import Permission from "../components/Security/Permission";
import Profile from "../components/Users/Profile";
import { FEATURE_LIST, PERMISSION_TYPES } from "../helper/permissions";
import EditProfile from "../components/Users/Profile/EditProfile";
export default function AppRouter() {
    const {isAuthenticated}=useAuth()
  return (
    <Routes>
      {/* Public route */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />

      {/* Protected dashboard routes */}
      <Route
        path="/dashboard/*"
        element={
          isAuthenticated ? (
            <DashboardLayout>
              <Routes>
                <Route path="" element={<Dashboard />} />
                <Route path="team" element={<ProtectedRoute feature={FEATURE_LIST.team} action={PERMISSION_TYPES.view}><Team /></ProtectedRoute>} />
                <Route path="create-employee" element={<ProtectedRoute feature={FEATURE_LIST.team} action={PERMISSION_TYPES.create}><CreateEmployee /></ProtectedRoute>} />
                <Route path="edit-employee/:id" element={<ProtectedRoute feature={FEATURE_LIST.team} action={PERMISSION_TYPES.patch}><EditEmployee/></ProtectedRoute>} />
                <Route path="permissions" element={<ProtectedRoute feature={FEATURE_LIST.permissions} action={PERMISSION_TYPES.view}><Permission/></ProtectedRoute>} />
                <Route path="edit-profile/:id" element={<ProtectedRoute feature={FEATURE_LIST.profile} action={PERMISSION_TYPES.patch}><EditProfile/></ProtectedRoute>} />
                <Route path="profile" element={<Profile/>} />
                <Route path="unauthorized" element={<Unauthorized/>} />
              </Routes>
            </DashboardLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}
