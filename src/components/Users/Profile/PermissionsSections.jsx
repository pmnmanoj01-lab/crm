import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../../context/store";
import { backendRoute, routes } from "../../../backendUrl";


const PermissionsSections = () => {
  const { user } = useAuth();

  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch permissions of logged user
  const fetchUserPermissions = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${backendRoute}${routes.getUserPermissions}${user._id}`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to load permissions");
      }

      // Extract access only
      setPermissions(data.permissions?.access || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPermissions();
  }, [user]);

  return (
    <div className="w-full bg-white p-5 rounded-xl shadow-sm border">
      <h2 className="text-lg font-semibold mb-4">Your Permissions</h2>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="text-red-500 text-sm mb-3">{error}</div>
      )}

      {/* PERMISSIONS LIST */}
      {!loading && !error && (
        <div className="space-y-4">
          {permissions?.length > 0 ? (
            permissions?.map((item, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-gray-50 shadow-sm"
              >
                <h3 className="font-semibold capitalize mb-2">
                  {item.feature}
                </h3>

                <div className="flex flex-wrap gap-2">
                  {item.permission.map((pCode) => (
                    <span
                      key={pCode}
                      className="text-xs bg-gray-200 px-3 py-1 rounded-md font-medium"
                    >
                      {pCode === 0 && "Edit"}
                      {pCode === 1 && "Create"}
                      {pCode === 2 && "Delete"}
                      {pCode === 3 && "View"}
                      {pCode === 4 && "Patch"}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No permissions assigned.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PermissionsSections;
