import { useState, useEffect } from "react";
import { Edit, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backendRoute, routes } from "../../backendUrl";
import { useAccess } from "../hooks/canAccess";
import { useAuth } from "../../context/store";
import DeleteConfirmBox from "../Popups/DeleteConfirmBox";
import { FEATURE_LIST, PERMISSION_TYPES } from "../../helper/permissions";

const MATERIAL_DATA = ["Gold", "Silver", "Platinum", "Diamond"];

const ProductList = () => {
  const { user } = useAuth();
  const { can } = useAccess();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [material, setMaterial] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  // Confirm Modal States ⭐
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const isPrivileged =
    user.role === "admin" ||
    user.role === "Manager" ||
    user.role === "Product Manager";

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page,
        limit,
        search,
        material,
      });

      if (!isPrivileged) {
        params.append("userId", user._id);
      }

      const res = await fetch(
        `${backendRoute}${routes.getAllProducts}?${params}`,
        { method: "GET", credentials: "include" }
      );

      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      setProducts(data.products);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchProducts, 500);
    return () => clearTimeout(t);
  }, [page, limit, search, material]);

  // DELETE FUNCTION
  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(
        `${backendRoute}${routes.deleteProduct}/${deleteId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="custom-scroll overflow-y-auto h-full p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>

        {can(FEATURE_LIST.product, PERMISSION_TYPES.create) && (
          <Link
            to="/dashboard/products/create"
            className="flex items-center gap-2 bg-[#3c3d3d] text-white px-4 py-2 rounded-lg hover:bg-black transition"
          >
            <Plus size={18} /> Add Product
          </Link>
        )}
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-4 mb-6 bg-white p-4 rounded shadow">
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 px-3 py-2 rounded w-64 focus:outline-none"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="border border-gray-300 px-3 py-2 rounded focus:outline-none"
          value={material}
          onChange={(e) => {
            setMaterial(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Materials</option>
          {MATERIAL_DATA.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="border border-gray-300 px-3 py-2 rounded focus:outline-none"
        >
          <option value={5}>5</option>
          <option value={8}>8</option>
          <option value={12}>12</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left font-semibold">Product Id</th>
              <th className="p-4 text-left font-semibold">Material</th>
              <th className="p-4 text-left font-semibold">Sub Category</th>
              <th className="p-4 text-left font-semibold">Child Category</th>
              <th className="p-4 text-left font-semibold">Weight Provided</th>
              <th className="p-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr
                  key={p._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="p-4">#BP001</td>
                  <td className="p-4">{p.material || "—"}</td>
                  <td className="p-4">{p.subCategory || "—"}</td>
                  <td className="p-4">{p.childCategory || "—"}</td>
                  <td className="p-4">{p.weightProvided || "—"}</td>

                  <td className="p-4 flex gap-4 justify-center">
                    {can(FEATURE_LIST.product, PERMISSION_TYPES.edit) &&<button
                    className="cursor-pointer"
                      onClick={() =>
                        navigate(`/dashboard/products/edit-product/${p._id}`)
                      }
                    >
                      <Edit size={18}  />
                    </button>}

                    {can(FEATURE_LIST.product, PERMISSION_TYPES.delete) &&<button
                      className="text-red-600 cursor-pointer"
                      onClick={() => {
                        setDeleteId(p._id);
                        setConfirmOpen(true); // ⭐ OPEN POPUP
                      }}
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
      <div className="flex justify-between items-center mt-6">
        <div className="font-medium">
          Page {page} of {totalPages}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="border px-3 py-2 rounded border-gray-300 hover:border-gray-400 cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="border px-3 py-2 rounded border-gray-300 hover:border-gray-400 cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* CONFIRM BOX COMPONENT ⭐ */}
      <DeleteConfirmBox
        open={confirmOpen}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ProductList;
