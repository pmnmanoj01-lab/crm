import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProductionRoles } from "../../../helper/permissions";
import { backendRoute, routes } from "../../../backendUrl";
import { useAuth } from "../../../context/store";
import { toast } from "react-toastify";

const sanitizeNumber = (num) => Math.max(0, Number(num) || 0);

/* -----------------------------
   Diamond → Category Structure
------------------------------ */
const MATERIAL_DATA = {
  Diamond: {
    "Natural Diamond": ["Plain", "Stone", "Kundan"],
    "Lab Stone": ["Plain", "Stone", "Kundan"],
    Mozonight: ["Plain", "Stone", "Kundan"],
    "Color Stone": ["Plain", "Stone", "Kundan"],
  },
};

const Setting = () => {
  const { productId } = useParams();
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [product, setProduct] = useState(null);

  const [formData, setFormData] = useState({
    weight: "",
    returnedWeight: "",
    remainingWeight: "",
    userId: "",
    diamondCategory: "",
    diamondSubCategory: "",
    diamondChildCategory: "",
    diamondWeight: "",
  });

  /* WHO CAN EDIT */
  const isEditable =
    user.role === "admin" ||
    (user.category === "Manager" && user.role === "Manager") ||
    (user.category === "Production" && user.role === "Manager");

  const showSelectUser = isEditable;
  const ROLE_LIST = [ProductionRoles.Setting];

  /* ----------------------------- 
     1️⃣ FETCH USERS 
  ------------------------------ */
  useEffect(() => {
    if (!showSelectUser) return;

    const fetchUsers = async () => {
      try {
        let url = `${backendRoute}${routes.fetchUserOfProductionATORole}?roles=${ROLE_LIST.join(",")}`;

        const res = await fetch(url, { method: "GET", credentials: "include" });
        const data = await res.json();

        setUsers(data.users || []);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };

    fetchUsers();
  }, [showSelectUser]);

  /* ----------------------------- 
     2️⃣ AUTO ASSIGN USER FOR WORKER 
  ------------------------------ */
  useEffect(() => {
    if (!showSelectUser) {
      setFormData((prev) => ({ ...prev, userId: user._id }));
    }
  }, [showSelectUser, user]);

  /* ----------------------------- 
     3️⃣ FETCH PRODUCT WHEN EDITING 
  ------------------------------ */
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${backendRoute}${routes.getProductSetting}${productId}`,
          { method: "GET", credentials: "include" }
        );

        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
        }
      } catch (err) {
        console.error("Error loading product", err);
      }
    };

    fetchProduct();
  }, [productId]);

  /* ----------------------------- 
     4️⃣ SET FORM DATA AFTER PRODUCT LOADED 
  ------------------------------ */
  useEffect(() => {
    if (!product) return;

    setFormData({
      weight: product.weightProvided || "",
      returnedWeight: product.returnedWeight || "",
      remainingWeight: product.remainingWeight || "",
      userId: product.userId?._id || "",

      diamondCategory: product.diamondCategory || "",
      diamondSubCategory: product.diamondSubCategory || "",
      diamondChildCategory: product.diamondChildCategory || "",
      diamondWeight: product.diamondWeight || "",
    });
  }, [product]);

  /* ----------------------------- 
     5️⃣ AUTO CALCULATE LOSS 
  ------------------------------ */
  useEffect(() => {
    const w = sanitizeNumber(formData.weight);
    const r = sanitizeNumber(formData.returnedWeight);

    setFormData((prev) => ({
      ...prev,
      remainingWeight: r > 0 ? Math.max(w - r, 0) : 0,
    }));
  }, [formData.weight, formData.returnedWeight]);

  /* ----------------------------- 
     6️⃣ SUBMIT FORM 
  ------------------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalData = {
      product: productId,
      userId: formData.userId,
      material: "Diamond",

      weightProvided: Number(formData.weight),
      returnedWeight: Number(formData.returnedWeight),
      remainingWeight: Number(formData.remainingWeight),

      diamondCategory: formData.diamondCategory,
      diamondSubCategory: formData.diamondSubCategory,
      diamondChildCategory: formData.diamondChildCategory,
      diamondWeight: Number(formData.diamondWeight),
    };

    try {
      const isEdit = Boolean(product);

      const url = isEdit
        ? `${backendRoute}${routes.updateProductSetting}${productId}`
        : `${backendRoute}${routes.createProductSetting}`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(finalData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(isEdit ? "Setting Updated!" : "Setting Added!");
      } else {
        toast.error(data.message || "Failed to save");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };

  /* ----------------------------- 
     DROPDOWN HANDLING 
  ------------------------------ */
  const subCats =
    formData.diamondCategory &&
    MATERIAL_DATA[formData.diamondCategory]
      ? Object.keys(MATERIAL_DATA[formData.diamondCategory])
      : [];

  const childCats =
    formData.diamondCategory &&
    formData.diamondSubCategory &&
    MATERIAL_DATA[formData.diamondCategory]?.[formData.diamondSubCategory]
      ? MATERIAL_DATA[formData.diamondCategory][formData.diamondSubCategory]
      : [];

  /* ----------------------------- 
     UI (same styling) 
  ------------------------------ */
  return (
    <div className="max-w-full mx-auto bg-white p-6 rounded-xl mt-5">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">
        {product ? "Edit Setting" : "Setting Form"}
      </h2>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-5">
          {productId && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Product ID
              </label>
              <input
                type="text"
                value={product?.productCode || "#BP001"}
                disabled
                className="w-full border bg-gray-100 rounded-lg px-3 py-2 border-gray-300 focus:outline-none"
              />
            </div>
          )}

          {/* Diamond Category */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Diamond Category
            </label>
            <select
              value={formData.diamondCategory}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  diamondCategory: e.target.value,
                  diamondSubCategory: "",
                  diamondChildCategory: "",
                })
              }
              className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:outline-none"
            >
              <option value="">-- Select Category --</option>
              {Object.keys(MATERIAL_DATA).map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Sub Category */}
          {subCats.length > 0 && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Sub Category
              </label>
              <select
                value={formData.diamondSubCategory}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    diamondSubCategory: e.target.value,
                    diamondChildCategory: "",
                  })
                }
                className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:outline-none"
              >
                <option value="">-- Select Sub Category --</option>
                {subCats.map((sub) => (
                  <option key={sub}>{sub}</option>
                ))}
              </select>
            </div>
          )}

          {/* Child Category */}
          {childCats.length > 0 && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Child Category
              </label>
              <select
                value={formData.diamondChildCategory}
                onChange={(e) =>
                  setFormData({ ...formData, diamondChildCategory: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:outline-none"
              >
                <option value="">-- Select Child Category --</option>
                {childCats.map((child) => (
                  <option key={child}>{child}</option>
                ))}
              </select>
            </div>
          )}

          {/* Diamond Weight */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Diamond Weight
            </label>
            <input
              type="number"
              value={formData.diamondWeight}
              onChange={(e) =>
                setFormData({ ...formData, diamondWeight: sanitizeNumber(e.target.value) })
              }
              className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:outline-none"
            />
          </div>

          {/* Weight Provided */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Weight Provided
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) =>
                setFormData({ ...formData, weight: sanitizeNumber(e.target.value) })
              }
              className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:outline-none"
            />
          </div>

          {/* Returned Weight */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Returned Weight
            </label>
            <input
              type="number"
              value={formData.returnedWeight}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  returnedWeight: sanitizeNumber(e.target.value),
                })
              }
              className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:outline-none"
            />
          </div>

          {/* Weight Loss */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Weight Loss</label>
            <input
              type="number"
              value={formData.remainingWeight}
              disabled
              className="w-full border bg-gray-100 rounded-lg px-3 py-2 border-gray-300 focus:outline-none"
            />
          </div>

          {/* Setting User */}
          {showSelectUser && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Setting User</label>
              <select
                value={formData.userId}
                onChange={(e) =>
                  setFormData({ ...formData, userId: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:outline-none"
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
          className="w-36 bg-[#3c3d3d] text-white py-2 rounded-lg hover:bg-black"
        >
          {productId ? "Update Setting" : "Submit Setting"}
        </button>
      </form>
    </div>
  );
};

export default Setting;
