import { Link } from "react-router-dom";
import {
  Home,
  Shield,
  Users,
  User2,
  LogOut,
  PackageSearch,
  PlusCircle,
  Package,
  UserCheck,
  Palette
} from "lucide-react";
import { useAuth } from "../../context/store";
import { useAccess } from "../hooks/canAccess";
import { FEATURE_LIST, PERMISSION_TYPES } from "../../helper/permissions";
import { useState } from "react";
export default function Sidebar() {
  const { logout, user, exitImpersonation } = useAuth();
  const { can } = useAccess();

  const [openProduct, setOpenProduct] = useState(false);
  const [openDesigner, setOpenDesigner] = useState(false); // ✅ NEW

  return (
    <aside className="h-screen w-52 bg-[#3c3d3d] text-white p-4 space-y-6 relative overflow-y-scroll custom-scroll">

      {/* LOGO */}
      <h2 className="text-2xl font-bold mb-2">
        <img
          src="/bhunte_logo1.png"
          className="text-white"
          alt="bhunte jewellers logo"
        />
      </h2>

      {user?.isImpersonating && (
        <div className="flex items-center gap-2 bg-white/10 text-gray-200 px-3 py-1 rounded-md text-xs border border-white/20">
          <UserCheck size={14} className="text-blue-400" />
          Impersonating
        </div>
      )}

      <div className="w-full h-px bg-white mb-4"></div>

      <nav className="space-y-4">
        {/* DASHBOARD */}
        {can(FEATURE_LIST.dashboard) && (
          <Link to="/dashboard" className="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded">
            <Home size={20} />
            <span>Dashboard</span>
          </Link>
        )}
          <Link to="/dashboard/master" className="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded">
            <Home size={20} />
            <span>Master</span>
          </Link>
        {/* TEAM */}
        {can(FEATURE_LIST.team) && (
          <Link to="/dashboard/team" className="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded">
            <Users size={20} />
            <span>Team</span>
          </Link>
        )}

        {/* PERMISSIONS */}
        {can(FEATURE_LIST.permissions) &&
          (user?.role === "admin" || user?.category === "Manager") && (
            <Link to="/dashboard/permissions" className="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded">
              <Shield size={20} />
              <span>Permissions</span>
            </Link>
          )}

        {/* PRODUCT DROPDOWN */}
        {can(FEATURE_LIST.product) && (
          <div>
            <button
              onClick={() => setOpenProduct(!openProduct)}
              className="flex items-center justify-between cursor-pointer w-full hover:bg-gray-800 p-2 rounded"
            >
              <span className="flex items-center space-x-3">
                <Package size={20} />
                <span>Products</span>
              </span>
              <span className="text-sm ">{openProduct ? "▲" : "▼"}</span>
            </button>

            {openProduct && (
              <div className="ml-8 mt-2 space-y-2">
                {can(FEATURE_LIST.product, PERMISSION_TYPES.view) && (
                  <Link to="/dashboard/products" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
                    <PackageSearch size={16} />
                    <span className="text-sm">Product List</span>
                  </Link>
                )}

                {can(FEATURE_LIST.product, PERMISSION_TYPES.patch) && (
                  <Link to="/dashboard/products/create" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
                    <PlusCircle size={16} />
                    <span className="text-sm">Create Product</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {/* ✅ DESIGNER DROPDOWN */}
        {can(FEATURE_LIST.designer) && (
          <div>
            <button
              onClick={() => setOpenDesigner(!openDesigner)}
              className="flex items-center justify-between cursor-pointer w-full hover:bg-gray-800 p-2 rounded"
            >
              <span className="flex items-center space-x-3">
                <Palette size={20} />
                <span>Designer</span>
              </span>
              <span className="text-sm ">{openDesigner ? "▲" : "▼"}</span>
            </button>

            {openDesigner && (
              <div className="ml-8 mt-2 space-y-2">
                {can(FEATURE_LIST.designer, PERMISSION_TYPES.view) && (
                  <Link
                    to="/dashboard/designer/products"
                    className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded"
                  >
                    <PackageSearch size={16} />
                    <span className="text-sm">Product List</span>
                  </Link>
                )}

                {can(FEATURE_LIST.designer, PERMISSION_TYPES.patch) && (
                  <Link
                    to="/dashboard/designer/create-product"
                    className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded"
                  >
                    <PlusCircle size={16} />
                    <span className="text-sm">Create Product</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
        {/* PROFILE */}
        {can(FEATURE_LIST.profile) && (
          <Link to="/dashboard/profile" className="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded">
            <User2 size={20} />
            <span>Profile</span>
          </Link>
        )}

        {/* LOGOUT / EXIT */}
        {user?.isImpersonating ? (
          <button
            onClick={exitImpersonation}
            className="flex items-center space-x-3 cursor-pointer w-full bg-white/10 hover:bg-white/20 p-2 rounded border"
          >
            <LogOut size={20} className="text-blue-400" />
            <span>Exit {user.name}</span>
          </button>
        ) : (
          <button
            onClick={logout}
            className="flex items-center cursor-pointer space-x-3 w-full hover:bg-gray-800 p-2 rounded"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        )}

      </nav>
    </aside>
  );
}
