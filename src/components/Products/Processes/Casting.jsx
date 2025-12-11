import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProductionRoles } from "../../../helper/permissions";
import { backendRoute, routes } from "../../../backendUrl";
import { useAuth } from "../../../context/store";
import { toast } from "react-toastify";

const MATERIAL_DATA = {
  Gold: {
    "Rose Gold": ["Plain", "Stone", "Kundan"],
    "White Gold": ["Rough", "Medium", "Fine"],
    "Yellow Gold": ["Rough", "Medium", "Fine"],
  },
  Silver: {
    Casting: ["Raw", "Refined"],
    Polishing: ["Matt", "Glossy"],
  },
  Platinum: {},
  // Diamond: {
  //   "Natural Diamond": ["Plain", "Stone", "Kundan"],
  //   "Lab Stone": ["Plain", "Stone", "Kundan"],
  //   Mozonight: ["Plain", "Stone", "Kundan"],
  //   "Color Stone": ["Plain", "Stone", "Kundan"],
  // },
};
const sanitizeNumber = (num) => Math.max(0, Number(num) || 0);

const Casting = ({processId}) => {
  const { productId } = useParams(); // 👈 get id from URL
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    materialName: "",
    subCategory: "",
    childCategory: "",
    weight: "",
    returnedWeight: "",
    remainingWeight: "",
    userId: "",
  });

  const isEditable =
    user.role === "admin" ||
    (user.category === "Manager" && user.role === "Manager") ||
    (user.category === "Production" && user.role === "Manager");

  const showSelectUser = isEditable;
  const ROLE_LIST = [ProductionRoles.Casting];

  /* ---------------------------------------
     1️⃣ FETCH USERS (For admin/manager only)
  ---------------------------------------- */
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

  /* ---------------------------------------
     2️⃣ AUTO-ASSIGN userId for employees
  ---------------------------------------- */
  useEffect(() => {
    if (!showSelectUser) {
      setFormData((prev) => ({ ...prev, userId: user._id }));
    }
  }, [showSelectUser, user]);

  /* ---------------------------------------
     3️⃣ FETCH PRODUCT DETAILS IF EDIT MODE
  ---------------------------------------- */
  useEffect(() => {
    if (!productId) return; // ⛔ no edit mode → skip

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${backendRoute}${routes.getProductById}${productId}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        // console.log("single products data is here as---------> ",data)
        if (!data.success) return;

        const p = data.data;

        setFormData({
          materialName: p.material || "",
          subCategory: p.subCategory || "",
          childCategory: p.childCategory || "",
          weight: p.weightProvided || "",
          returnedWeight: p.returnedWeight || "",
          remainingWeight: p.remainingWeight || "",
          userId: p.userId?._id || "",
        });

      } catch (err) {
        console.error("Error loading product", err);
      }
    };

    fetchProduct();
  }, [productId]);

  /* ---------------------------------------
     4️⃣ CALCULATE REMAINING WEIGHT
  ---------------------------------------- */
  useEffect(() => {
    const w = sanitizeNumber(formData.weight);
    const r = sanitizeNumber(formData.returnedWeight);
    if (r > 0) {
      setFormData((prev) => ({
        ...prev,
        remainingWeight: Math.max(w - r, 0),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        remainingWeight: 0,
      }));
    }

  }, [formData.weight, formData.returnedWeight]);

  const hasSubCategories =
    formData.materialName &&
    Object.keys(MATERIAL_DATA[formData.materialName]).length > 0;

  const hasChildCategories =
    hasSubCategories &&
    formData.subCategory &&
    MATERIAL_DATA[formData.materialName][formData.subCategory]?.length > 0;

  /* ---------------------------------------
     5️⃣ SUBMIT FORM
  ---------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalData = {
      material: formData.materialName,
      subCategory: hasSubCategories ? formData.subCategory : null,
      childCategory: hasChildCategories ? formData.childCategory : null,
      weightProvided: Number(formData.weight),
      returnedWeight: Number(formData.returnedWeight),
      userId: formData.userId,
      processId
    };

    try {
      const url = productId
        ? `${backendRoute}${routes.updateProduct}${productId}`
        : `${backendRoute}${routes.createProduct}`;

      const method = productId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(finalData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(productId ? "Product Updated!" : "Product Created!");
      } else {
        toast.error(data.message || "Failed");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server Error");
    }
  };

  /* ---------------------------------------
     6️⃣ UI
  ---------------------------------------- */
  return (
    <div className="max-w-full mx-auto bg-white p-6 rounded-xl mt-5">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">
        {productId ? "Edit Casting" : "Casting Form"}
      </h2>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-5">

          {productId && <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Product ID
            </label>
            <input
              type="text"
              className="w-full border focus:outline-none border-gray-300 focus:border-gray-400 rounded-lg px-3 py-2 bg-gray-100"
              value="#BP001"
              disabled
            />
          </div>}

          {/* MATERIAL */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Material
            </label>
            <select
              className="w-full border focus:outline-none border-gray-300 focus:border-gray-400 rounded-lg px-3 py-2"
              disabled={!isEditable}
              value={formData.materialName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  materialName: e.target.value,
                  subCategory: "",
                  childCategory: "",
                })
              }
            >
              <option value="">-- Select Material --</option>
              {Object.keys(MATERIAL_DATA).map((mat) => (
                <option key={mat} value={mat}>
                  {mat}
                </option>
              ))}
            </select>
          </div>

          {/* SUB CATEGORY */}
          {hasSubCategories && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Sub Category
              </label>
              <select
                className="w-full border focus:outline-none border-gray-300 focus:border-gray-400 rounded-lg px-3 py-2"
                disabled={!isEditable}
                value={formData.subCategory}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subCategory: e.target.value,
                    childCategory: "",
                  })
                }
              >
                <option value="">-- Select Sub Category --</option>
                {Object.keys(MATERIAL_DATA[formData.materialName]).map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* CHILD CATEGORY */}
          {hasChildCategories && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Child Category
              </label>
              <select
                className="w-full border focus:outline-none border-gray-300 focus:border-gray-400 rounded-lg px-3 py-2"
                disabled={!isEditable}
                value={formData.childCategory}
                onChange={(e) =>
                  setFormData({ ...formData, childCategory: e.target.value })
                }
              >
                <option value="">-- Select Child Category --</option>
                {MATERIAL_DATA[formData.materialName][
                  formData.subCategory
                ].map((child) => (
                  <option key={child} value={child}>
                    {child}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* WEIGHT */}
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

          {/* RETURNED */}
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

          {/* REMAINING */}
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

          {/* USER */}
          {showSelectUser && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Select User
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
          {productId ? "Update Casting" : "Submit Casting"}
        </button>
      </form>
    </div>
  );
};

export default Casting;
