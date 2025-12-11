import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProductionRoles } from "../../../helper/permissions";
import { backendRoute, routes } from "../../../backendUrl";
import { useAuth } from "../../../context/store";
import { toast } from "react-toastify";

const sanitizeNumber = (num) => Math.max(0, Number(num) || 0);

const PrePolish = () => {
  const { productId } = useParams();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [product, setProduct] = useState(null);

  const [formData, setFormData] = useState({
    weight: "",
    returnedWeight: "",
    remainingWeight: "",
    userId: "",
  });

  /* --------------------------------------------
      WHO CAN EDIT
  --------------------------------------------- */
  const isEditable =
    user.role === "admin" ||
    (user.category === "Manager" && user.role === "Manager") ||
    (user.category === "Production" && user.role === "Manager");

  const showSelectUser = isEditable;
  const ROLE_LIST = [ProductionRoles.PrePolish];

  /* --------------------------------------------
      FETCH USERS (Admin / Manager Only)
  --------------------------------------------- */
  useEffect(() => {
    if (!showSelectUser) return;

    const fetchUsers = async () => {
      try {
        let url = `${backendRoute}${routes.fetchUserOfProductionATORole}`;
        url += `?roles=${ROLE_LIST.join(",")}`;

        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };

    fetchUsers();
  }, [showSelectUser]);

  /* --------------------------------------------
      AUTO ASSIGN USER FOR WORKER
  --------------------------------------------- */
  useEffect(() => {
    if (!showSelectUser) {
      setFormData((prev) => ({ ...prev, userId: user._id }));
    }
  }, [showSelectUser, user]);

  /* --------------------------------------------
      FETCH PRODUCT DETAILS
  --------------------------------------------- */
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${backendRoute}${routes.getProductPrePolish}${productId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await res.json();
        if (data.success) {
          setProduct(data.data || null);
        }
      } catch (err) {
        console.error("Error loading product", err);
      }
    };

    fetchProduct();
  }, [productId]);

  /* --------------------------------------------
      SET FORM VALUES AFTER PRODUCT LOAD
  --------------------------------------------- */
  useEffect(() => {
    if (!product) return;

    setFormData({
      weight: product.weightProvided || "",
      returnedWeight: product.returnedWeight || "",
      remainingWeight: product.remainingWeight || "",
      userId: product.userId?._id || "",
    });
  }, [product]);

  /* --------------------------------------------
      AUTO CALCULATE REMAINING WEIGHT
  --------------------------------------------- */
  useEffect(() => {
    const w = sanitizeNumber(formData.weight);
    const r = sanitizeNumber(formData.returnedWeight);

    setFormData((prev) => ({
      ...prev,
      remainingWeight: r > 0 ? Math.max(w - r, 0) : 0,
    }));
  }, [formData.weight, formData.returnedWeight]);

  /* --------------------------------------------
      SUBMIT FORM
  --------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalData = {
      weightProvided: Number(formData.weight),
      returnedWeight: Number(formData.returnedWeight),
      remainingWeight: Number(formData.remainingWeight),
      userId: formData.userId,
      product: productId,
    };

    try {
     

      const url = product
        ? `${backendRoute}${routes.updateProductPrePolish}${productId}`
        : `${backendRoute}${routes.createProductPrePolish}`;

      const method = product ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(finalData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(product ? "Product Updated!" : "Product Added!");
      } else {
        toast.error(data.message || "Failed");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error");
    }
  };

  /* --------------------------------------------
      UI (Styling SAME as your version)
  --------------------------------------------- */
  return (
    <div className="max-w-full mx-auto bg-white p-6 rounded-xl mt-5">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">
        {product?.prepolish ? "Edit PrePolish" : "PrePolish Form"}
      </h2>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-5">
          {/* PRODUCT ID */}
          {productId && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Product ID
              </label>
              <input
                type="text"
                className="w-full border focus:outline-none border-gray-300 focus:border-gray-400 rounded-lg px-3 py-2 bg-gray-100"
                value="#BP001"
                disabled
              />
            </div>
          )}

          {/* WEIGHT PROVIDED */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Weight Provided (grams)
            </label>
            <input
              type="number"
              className="w-full border focus:outline-none border-gray-300 focus:border-gray-400 rounded-lg px-3 py-2"
              disabled={!isEditable}
              value={formData.weight}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  weight: sanitizeNumber(e.target.value),
                })
              }
            />
          </div>

          {/* RETURNED WEIGHT */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Returned Weight (grams)
            </label>
            <input
              type="number"
              className="w-full border focus:outline-none border-gray-300 focus:border-gray-400 rounded-lg px-3 py-2"
              value={formData.returnedWeight}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  returnedWeight: sanitizeNumber(e.target.value),
                })
              }
            />
          </div>

          {/* REMAINING WEIGHT */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Weight Loss
            </label>
            <input
              type="number"
              className="w-full border focus:outline-none border-gray-300 focus:border-gray-400 rounded-lg px-3 py-2 bg-gray-100"
              value={formData.remainingWeight}
              disabled
            />
          </div>

          {/* USER SELECT */}
          {showSelectUser && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Select PrePolish User
              </label>
              <select
                className="w-full border focus:outline-none border-gray-300 focus:border-gray-400 rounded-lg px-3 py-2"
                value={formData.userId}
                onChange={(e) =>
                  setFormData({ ...formData, userId: e.target.value })
                }
              >
                <option value="">-- Select User --</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-36 bg-[#3c3d3d] cursor-pointer text-white py-2 rounded-lg hover:bg-black"
        >
          {product?.prepolish ? "Update PrePolish" : "Submit PrePolish"}
        </button>
      </form>
    </div>
  );
};

export default PrePolish;
