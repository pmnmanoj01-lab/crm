import { useState, useEffect, useMemo } from "react";
import { Edit, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backendRoute, routes } from "../../backendUrl";
import { useAccess } from "../hooks/canAccess";
import { FEATURE_LIST, PERMISSION_TYPES } from "../../helper/permissions";

const CATEGORY_BADGE_COLORS = {
  Ring: "bg-blue-100 text-blue-800",
  Necklace: "bg-yellow-100 text-yellow-800",
  Bracelet: "bg-green-100 text-green-800",
  Earring: "bg-purple-100 text-purple-800",
  default: "bg-gray-100 text-gray-800",
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const { can } = useAccess();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    try {
      if (!products.length) setLoading(true);
      else setIsFiltering(true);

      const params = new URLSearchParams({
        page,
        limit,
        search,
        category: filterCategory === "all" ? "" : filterCategory,
        sortBy,
        order,
      });

      const res = await fetch(
        `${backendRoute}${routes.getAllProducts}?${params}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        toast.error("Failed to load products");
        return;
      }

      const data = await res.json();

      setProducts(data.products || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
      setIsFiltering(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(delay);
  }, [page, limit, search, filterCategory, sortBy, order]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${backendRoute}${routes.deleteProduct}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  const handleSortToggle = (field) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  // Unique categories
  const categoryOptions = useMemo(() => {
    const setCategories = new Set(products.map((p) => p.category).filter(Boolean));
    return ["all", ...Array.from(setCategories)];
  }, [products]);

  return (
    <div className="custom-scroll overflow-y-auto h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>

        {can(FEATURE_LIST.products, PERMISSION_TYPES.create) && (
          <Link
            to="/dashboard/products/create"
            className="flex items-center gap-2 bg-[#3c3d3d] text-white px-4 py-2 rounded-lg hover:bg-black"
          >
            <Plus size={18} /> Add Product
          </Link>
        )}
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-4">
        {/* search */}
        <input
          type="text"
          placeholder="Search product..."
          className="border border-gray-300 px-3 py-2 rounded w-full md:w-64 focus:outline-none"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* category */}
        <select
          className="border border-gray-300 px-3 py-2 rounded focus:outline-none"
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setPage(1);
          }}
        >
          {categoryOptions.map((c) => (
            <option key={c} value={c === "all" ? "all" : c}>
              {c === "all" ? "All Categories" : c}
            </option>
          ))}
        </select>

        {/* sorting */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSortToggle("name")}
            className="px-3 py-2 border border-gray-300 rounded"
          >
            Sort by Name {sortBy === "name" ? (order === "asc" ? "↑" : "↓") : ""}
          </button>

          <button
            onClick={() => handleSortToggle("price")}
            className="px-3 py-2 border border-gray-300 rounded"
          >
            Sort by Price {sortBy === "price" ? (order === "asc" ? "↑" : "↓") : ""}
          </button>

          {/* limit */}
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

      {/* PRODUCT TABLE */}
      <div className="w-full bg-white shadow rounded overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {/* shimmer */}
            {loading && !products.length ? (
              <>
                {Array.from({ length: limit }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-300">
                    <td className="p-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-40" />
                    </td>
                    <td className="p-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                    </td>
                    <td className="p-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                    </td>
                    <td className="p-3 text-center">
                      <div className="h-6 bg-gray-200 w-24 rounded animate-pulse mx-auto" />
                    </td>
                  </tr>
                ))}
              </>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr
                  key={p._id}
                  className="border-b border-gray-300 hover:bg-gray-50"
                >
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        CATEGORY_BADGE_COLORS[p.category] ||
                        CATEGORY_BADGE_COLORS.default
                      }`}
                    >
                      {p.category}
                    </span>
                  </td>
                  <td className="p-3">₹{p.price}</td>

                  {/* actions */}
                  <td className="p-3 flex gap-3 justify-center">
                    {can(FEATURE_LIST.products, PERMISSION_TYPES.patch) && (
                      <button
                        onClick={() =>
                          navigate(`/dashboard/products/edit/${p._id}`)
                        }
                        className="text-[#3c3d3d] hover:text-black"
                      >
                        <Edit size={18} />
                      </button>
                    )}

                    {can(FEATURE_LIST.products, PERMISSION_TYPES.delete) && (
                      <button
                        onClick={() => handleDelete(p._id)}
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
        <div>
          Page {page} of {totalPages}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                className={`px-2 py-1 border border-gray-300 rounded ${
                  p === page ? "bg-gray-800 text-white" : ""
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

export default ProductList;
