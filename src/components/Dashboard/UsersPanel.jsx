import { useEffect, useState } from "react";
import { UserCheck, Search, ChevronRight, ChevronLeft, UserCog } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/store";
import { backendRoute, routes } from "../../backendUrl";

export default function UsersPanel() {
  const { user } = useAuth();

  // 🔹 USERS STATE
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  // 🔹 PAGINATION + FILTERS
  const [page, setPage] = useState(1);
  const limit = 8;
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  // 🔒 ONLY ADMIN


  // ===============================
  // 📡 FETCH USERS (YOUR LOGIC)
  // ===============================
  const fetchUsers = async () => {
    try {
      if (!employees.length) setLoading(true);
      else setIsFiltering(true);

      const params = new URLSearchParams({
        page,
        limit,
        search,
        role: filterRole === "all" ? "" : filterRole,
        sortBy,
        order,
      });

      const res = await fetch(
        `${backendRoute}${routes.getAllUsers}?${params}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        return;
      }

      const data = await res.json();
      setEmployees(data.users || []);
      setTotalPages(data.pagination?.totalPages || 1);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
      setIsFiltering(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, filterRole, sortBy, order]);
  if (user?.role !== "admin") return null;
  // ===============================
  // 🔁 IMPERSONATE USER
  // ===============================
  const openPanel = async (targetUserId, name) => {
    try {
      const res = await fetch(
        `${backendRoute}${routes.impersonateAdmin}${targetUserId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success(`Opened ${name}'s panel`);
        window.dispatchEvent(new Event("userLoggedIn"));
      } else {
        toast.error(data.message || "Failed");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">All Users</h3>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="pl-8 pr-3 py-2 border focus:outline-none border-gray-200 focus:border-gray-400 rounded text-sm"
          />
        </div>

        {/* <select
          value={filterRole}
          onChange={(e) => {
            setPage(1);
            setFilterRole(e.target.value);
          }}
          className="border px-3 py-2 rounded focus:outline-none border-gray-200 focus:border-gray-400 text-sm"
        >
          <option value="all">All Roles</option>
          <option value="Hr">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Employee">Employee</option>
        </select> */}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Department</th>
              <th className=" p-2 text-center align-middle">Open  Panel</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  No users found
                </td>
              </tr>
            ) : (
              employees?.map((u) => (
                <tr key={u._id} className="border-t border-gray-300 hover:bg-gray-200">
                  <td className="p-2">{u.name}</td>
                  {(u.category === "Manager" && u.role === "Manager") && <td className="p-2 capitalize">{u.role}</td>}
                  {(u.role === "Manager" && u.category !== "Manager") ? <td className="p-2 capitalize">{u.category} {u.role}</td> : <td className="p-2 capitalize">{u.role}</td>}
                  <td className="p-2">{u.
                    category || "-"}</td>
                  <td className="p-2 text-center align-middle">
                    <button
                      onClick={() => openPanel(u._id, u.name)}
                      className="inline-flex items-center cursor-pointer justify-center gap-2 px-3 py-1 
                                     bg-blue-600 text-white rounded hover:bg-blue-500"
                    >
                      <UserCog size={16} />
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="px-2 py-1 border cursor-pointer rounded disabled:opacity-50"
        >
          <ChevronLeft size={16} />
        </button>

        {Array.from({ length: totalPages }).map((_, idx) => {
          const p = idx + 1;
          return (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-2 py-1 cursor-pointer border border-gray-300 rounded 
              ${p === page ? "bg-gray-800 text-white" : ""}`}
            >
              {p}
            </button>
          );
        })}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
          className="px-2 cursor-pointer py-1 border rounded disabled:opacity-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {isFiltering && (
        <p className="text-xs text-gray-400">Updating results...</p>
      )}
    </div>
  );
}
