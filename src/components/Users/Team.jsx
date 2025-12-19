// frontend/src/pages/Team.jsx
import { useState, useEffect, useMemo } from "react";
import { Edit, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backendRoute, routes } from "../../backendUrl";
import { useAccess } from "../hooks/canAccess";
import { FEATURE_LIST, PERMISSION_TYPES } from "../../helper/permissions";
import DeleteConfirmBox from "../Popups/DeleteConfirmBox";
import StatusToggle from "../Popups/TogglePopup";
import { useAuth } from "../../context/store";

const ROLE_BADGE_COLORS = {
    Casting: "bg-yellow-100 text-yellow-800",
    Filing: "bg-indigo-100 text-indigo-800",
    Prepolish: "bg-purple-100 text-purple-800",
    Setting: "bg-blue-100 text-blue-800",
    Polish: "bg-green-100 text-green-800",
    Repair: "bg-red-100 text-red-800",
    default: "bg-gray-100 text-gray-800",
};

const Team = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);
    const { user } = useAuth()
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [order, setOrder] = useState("asc");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(8);
    const [totalPages, setTotalPages] = useState(1);

    const { can } = useAccess();
    const navigate = useNavigate();

    // Fetch Users
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

            const res = await fetch(`${backendRoute}${routes.getAllUsers}?${params}`, {
                method: "GET",
                credentials: "include"
            });

            if (!res.ok) {
                toast.error("Failed to load users");
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
        const delay = setTimeout(() => {
            fetchUsers();
        }, 500);

        return () => clearTimeout(delay);
    }, [page, limit, search, filterRole, sortBy, order]);

    // Handle Delete User
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${backendRoute}${routes.deleteUser}${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Delete failed");

            toast.success("User deleted");
            setEmployees((prev) => prev.filter((u) => u._id !== id));
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete user");
        }
    };

    const handleSortToggle = (field) => {
        if (sortBy === field) {
            setOrder((o) => (o === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(field);
            setOrder("asc");
        }
    };

    const toggleStatus = async (id, newStatus) => {
        try {
            const res = await fetch(
                `${backendRoute}${routes.updateStatusOfUser}${id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ isActive: newStatus }),
                }
            );

            if (!res.ok) throw new Error("Status update failed");

            setEmployees(prev =>
                prev.map(u =>
                    u._id === id ? { ...u, isActive: newStatus } : u
                )
            );

            toast.success(`User ${newStatus ? "Activated" : "Deactivated"}`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update status");
        }
    };


    const roleOptions = useMemo(() => {
        const setRoles = new Set(employees.map((u) => u.role).filter(Boolean));
        return ["all", ...Array.from(setRoles)];
    }, [employees]);

    return (
        <div className="custom-scroll overflow-y-auto h-full">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Employees</h1>

                {can(FEATURE_LIST.team, PERMISSION_TYPES.create) && (
                    <Link
                        to="/dashboard/create-employee"
                        className="flex items-center gap-2 bg-[#3c3d3d] text-white px-4 py-2 rounded-lg hover:bg-black"
                    >
                        <Plus size={18} /> Create Employee
                    </Link>
                )}
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap items-center gap-4 mb-6 bg-white p-4 rounded shadow">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="border border-gray-300 px-3 py-2 rounded w-full md:w-64 focus:outline-none"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                />

                <select
                    className="border border-gray-300 px-3 py-2 rounded focus:outline-none"
                    value={filterRole}
                    onChange={(e) => {
                        setFilterRole(e.target.value);
                        setPage(1);
                    }}
                >
                    {roleOptions.map((r) => (
                        <option key={r} value={r}>
                            {r === "all" ? "All Roles" : r}
                        </option>
                    ))}
                </select>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleSortToggle("name")}
                        className="px-3 py-2 border border-gray-300 rounded"
                    >
                        Sort by Name {sortBy === "name" ? (order === "asc" ? "↑" : "↓") : ""}
                    </button>

                    <button
                        onClick={() => handleSortToggle("role")}
                        className="px-3 py-2 border border-gray-300 rounded"
                    >
                        Sort by Role {sortBy === "role" ? (order === "asc" ? "↑" : "↓") : ""}
                    </button>

                    <select
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setPage(1);
                        }}
                        className="border rounded border-gray-300 focus:outline-none px-2 py-2"
                    >
                        <option value={5}>5</option>
                        <option value={8}>8</option>
                        <option value={12}>12</option>
                        <option value={20}>20</option>
                    </select>
                </div>
            </div>

            {/* USERS TABLE */}
            <div className="w-full bg-white shadow rounded overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Phone</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3 text-center">Status</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading && !employees.length ? (
                            <>
                                {Array.from({ length: limit }).map((_, i) => (
                                    <tr key={i} className="border-b border-gray-300">
                                        <td className="p-3"><div className="h-4 bg-gray-200 rounded animate-pulse w-40" /></td>
                                        <td className="p-3"><div className="h-4 bg-gray-200 rounded animate-pulse w-56" /></td>
                                        <td className="p-3"><div className="h-4 bg-gray-200 rounded animate-pulse w-32" /></td>
                                        <td className="p-3"><div className="h-4 bg-gray-200 rounded animate-pulse w-24" /></td>
                                        <td className="p-3"><div className="h-4 bg-gray-200 rounded animate-pulse w-24" /></td>


                                        <td className="p-3 text-center"><div className="h-6 bg-gray-200 w-24 rounded animate-pulse mx-auto" /></td>
                                    </tr>
                                ))}
                            </>
                        ) : employees.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-4 text-center">No users found</td>
                            </tr>
                        ) : (
                            employees.map((emp) => (
                                <tr key={emp._id} className="border-b border-gray-300 hover:bg-gray-50">
                                    <td className="p-3">{emp.name}</td>
                                    <td className="p-3">{emp.email}</td>
                                    <td className="p-3">{emp.phone || "-"}</td>
                                    <td className="p-3">
                                        {(emp.category === "Manager" && emp.role === "Manager") && <span className={`px-2 py-1 rounded text-sm ${ROLE_BADGE_COLORS[emp.role] || ROLE_BADGE_COLORS.default}`}>
                                            {emp.role}
                                        </span>}
                                        {(emp.category !== "Manager" && emp.role === "Manager") ? <span className={`px-2 py-1 rounded text-sm ${ROLE_BADGE_COLORS[emp.role] || ROLE_BADGE_COLORS.default}`}>
                                          {emp.category}  {emp.role}
                                        </span> : <span className={`px-2 py-1 rounded text-sm ${ROLE_BADGE_COLORS[emp.role] || ROLE_BADGE_COLORS.default}`}>
                                            {emp.role}
                                        </span>}
                                    </td>
                                    {user?.role === "admin" && <td className="p-3 text-center">
                                        <StatusToggle
                                            value={emp.isActive}
                                            onChange={(val) => toggleStatus(emp._id, val)}
                                            disabled={!can(FEATURE_LIST.team, PERMISSION_TYPES.patch)}
                                        />
                                    </td>}

                                    <td className="p-3 flex gap-3 justify-center">
                                        {can(FEATURE_LIST.team, PERMISSION_TYPES.patch) && (
                                            <button
                                                onClick={() => navigate(`/dashboard/edit-employee/${emp._id}`)}
                                                className="text-[#3c3d3d] hover:text-black"
                                            >
                                                <Edit size={18} />
                                            </button>
                                        )}

                                        {can(FEATURE_LIST.team, PERMISSION_TYPES.delete) && (
                                            <button
                                                onClick={() => {
                                                    setDeleteId(emp._id);
                                                    setConfirmOpen(true);
                                                }}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between items-center mt-4">
                <div>Page {page} of {totalPages}</div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: totalPages }).map((_, idx) => {
                        const p = idx + 1;
                        return (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`px-2 py-1 border border-gray-300 rounded 
                                    ${p === page ? "bg-gray-800 text-white" : ""}`}
                            >
                                {p}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* DELETE CONFIRM MODAL */}
            <DeleteConfirmBox
                open={confirmOpen}
                title="Delete Employee"
                message="Are you sure you want to delete this employee?"
                onCancel={() => {
                    setConfirmOpen(false);
                    setDeleteId(null);
                }}
                onConfirm={() => {
                    handleDelete(deleteId);
                    setConfirmOpen(false);
                    setDeleteId(null);
                }}
            />
        </div>
    );
};

export default Team;
