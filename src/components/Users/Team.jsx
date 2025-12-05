// frontend/src/pages/Team.jsx
import { useState, useEffect, useMemo } from "react";
import { Edit, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backendRoute, routes } from "../../backendUrl";
import {useAccess } from "../hooks/canAccess";
import { FEATURE_LIST, PERMISSION_TYPES } from "../../helper/permissions";

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

    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [order, setOrder] = useState("asc");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(8);
    const [totalPages, setTotalPages] = useState(1);
 const {can}=useAccess()
    const navigate = useNavigate();

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

            // Only update list — no page refresh
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

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${backendRoute}${routes.deleteUser}${id}`, {
                method: "DELETE",
                credentials: "include"
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

    const roleOptions = useMemo(() => {
        const setRoles = new Set(employees.map((u) => u.role).filter(Boolean));
        return ["all", ...Array.from(setRoles)];
    }, [employees]);

    return (
        <div className=" custom-scroll overflow-y-auto h-full">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Employees</h1>

                {can(FEATURE_LIST.team,PERMISSION_TYPES.create)&& <Link
                    to="/dashboard/create-employee"
                    className="flex items-center gap-2 bg-[#3c3d3d] text-white px-4 py-2 rounded-lg hover:bg-black"
                >
                    <Plus size={18} /> Create Employee
                </Link>}
            </div>

            {/* FILTERS */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-4">
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
                        <option key={r} value={r === "all" ? "all" : r}>
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
                                        <span className={`px-2 py-1 rounded text-sm ${ROLE_BADGE_COLORS[emp.role] || ROLE_BADGE_COLORS.default}`}>
                                            {emp.role}
                                        </span>
                                    </td>
                                    <td className="p-3 flex gap-3 justify-center">
                                        {can(FEATURE_LIST.team,PERMISSION_TYPES.patch)&&<button
                                            onClick={() => navigate(`/dashboard/edit-employee/${emp._id}`)}
                                            className="text-[#3c3d3d] hover:text-black"
                                        >
                                            <Edit size={18} />
                                        </button>}

                                       {can(FEATURE_LIST.team,PERMISSION_TYPES.delete)&& <button
                                            onClick={() => handleDelete(emp._id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={18} />
                                        </button>}
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
        </div>
    );
};

export default Team;
