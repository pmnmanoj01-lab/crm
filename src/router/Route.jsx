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
import ProductList from "../components/Products/ProductList";
import CreateProduct from "../components/Products/CreateProduct";
import EditProduct from "../components/Products/EditProduct";
import DesignProductList from "../components/Desinger/ProductList";
import CreateDesignProduct from "../components/Desinger/CreateProduct";
import EidtDesignProduct from "../components/Desinger/EditProduct";

// NEW IMPORTS

export default function AppRouter() {
  const { isAuthenticated } = useAuth();

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

                {/* TEAM ROUTES */}
                <Route
                  path="team"
                  element={
                    <ProtectedRoute feature={FEATURE_LIST.team} action={PERMISSION_TYPES.view}>
                      <Team />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="create-employee"
                  element={
                    <ProtectedRoute feature={FEATURE_LIST.team} action={PERMISSION_TYPES.create}>
                      <CreateEmployee />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="edit-employee/:id"
                  element={
                    <ProtectedRoute feature={FEATURE_LIST.team} action={PERMISSION_TYPES.patch}>
                      <EditEmployee />
                    </ProtectedRoute>
                  }
                />

                {/* PERMISSIONS */}
                <Route
                  path="permissions"
                  element={
                    <ProtectedRoute feature={FEATURE_LIST.permissions} action={PERMISSION_TYPES.view}>
                      <Permission />
                    </ProtectedRoute>
                  }
                />

                {/* PROFILE */}
                <Route
                  path="edit-profile/:id"
                  element={
                    <ProtectedRoute feature={FEATURE_LIST.profile} action={PERMISSION_TYPES.patch}>
                      <EditProfile />
                    </ProtectedRoute>
                  }
                />
                <Route path="profile" element={<Profile />} />

                {/* PRODUCTS (NEW) */}
                <Route
                  path="products"
                  element={
                    <ProtectedRoute feature={FEATURE_LIST.product} action={PERMISSION_TYPES.view}>
                      <ProductList />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="products/create"
                  element={
                    <ProtectedRoute feature={FEATURE_LIST.product} action={PERMISSION_TYPES.create}>
                      <CreateProduct />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="products/edit-product/:productId"
                  element={
                    <ProtectedRoute feature={FEATURE_LIST.product} action={PERMISSION_TYPES.edit}>
                      <EditProduct />
                    </ProtectedRoute>
                  }
                />
                  <Route
                  path="designer/products"
                  element={
                    <ProtectedRoute feature={FEATURE_LIST.designer} action={PERMISSION_TYPES.view}>
                      <DesignProductList />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="designer/create-product"
                  element={
                    <ProtectedRoute feature={FEATURE_LIST.designer} action={PERMISSION_TYPES.create}>
                      <CreateDesignProduct />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="designer/edit-product/:productId"
                  element={
                    <ProtectedRoute feature={FEATURE_LIST.designer} action={PERMISSION_TYPES.edit}>
                      <EidtDesignProduct />
                    </ProtectedRoute>
                  }
                />

                {/* Unauthorized */}
                <Route path="unauthorized" element={<Unauthorized />} />
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
