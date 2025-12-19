/** FULL UPDATED Repair COMPONENT WITH VALIDATION + AUTO EXTRA MATERIAL */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProductionRoles } from "../../../helper/permissions";
import { backendRoute, routes } from "../../../backendUrl";
import { useAuth } from "../../../context/store";
import { toast } from "react-toastify";

const sanitizeNumber = (num) => Math.max(0, Number(num) || 0);

let MATERIAL_DATA = {
  Gold: {
    "Yellow Gold": ["10kt", "14kt", "18kt", "22kt"],
    "White Gold": ["10kt", "14kt", "18kt", "22kt"],
    "Rose Gold": ["10kt", "14kt", "18kt", "22kt"],
  },
  Silver: {
    925: {},

  },
  Platinum: {},
};

const Repair = ({ material, onProcessUpdated }) => {
  const filteredMaterialData =
    material && MATERIAL_DATA[material]
      ? { [material]: MATERIAL_DATA[material] }
      : MATERIAL_DATA;
  const { productId } = useParams();

  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [product, setProduct] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    weight: "",
    returnedWeight: "",
    remainingWeight: "",
    userId: "",
    needExtraMaterial: false,
    material: "",
    scrab: "",
    subCategory: "",
    childCategory: "",
    extraMaterialWeight: "",
  });

  /* ----------------------- ROLE PERMISSIONS ----------------------- */
  const isEditable =
    user.role === "admin" ||
    (user.category === "Manager" && user.role === "Manager") ||
    (user.category === "Production" && user.role === "Manager");

  const showSelectUser = isEditable;
  const ROLE_LIST = [ProductionRoles.Repair];

  /* ----------------------- VALIDATION ----------------------- */
  const validateExtraMaterial = () => {
    let newErrors = {};

    if (formData.needExtraMaterial) {
      if (!formData.material) newErrors.material = true;

      const subCategories = Object.keys(filteredMaterialData[formData.material] || {});
      if (subCategories.length > 0 && !formData.subCategory)
        newErrors.subCategory = true;

      const childCategories =
        filteredMaterialData[formData.material]?.[formData.subCategory] || [];
      if (childCategories.length > 0 && !formData.childCategory)
        newErrors.childCategory = true;

      if (!formData.extraMaterialWeight)
        newErrors.extraMaterialWeight = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ----------------------- FETCH USERS ----------------------- */
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

  /* AUTO ASSIGN USER */
  useEffect(() => {
    if (!showSelectUser) {
      setFormData((prev) => ({ ...prev, userId: user._id }));
    }
  }, [showSelectUser, user]);

  /* ----------------------- FETCH PRODUCT (EDIT MODE) ----------------------- */
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${backendRoute}${routes.getProductRepair}${productId}`,
          { method: "GET", credentials: "include" }
        );

        const data = await res.json();
        if (!data.success) return;

        setProduct(data.data || {});
      } catch (err) {
        console.error("Error loading product", err);
      }
    };

    fetchProduct();
  }, [productId]);

  /* ----------------------- AUTO-FILL FORM WHEN PRODUCT LOADED ----------------------- */
  useEffect(() => {
    if (!product) return;

    const hasExtra =
      product.extraMaterialWeight && Number(product.extraMaterialWeight) > 0;

    setFormData((prev) => ({
      ...prev,
      weight: product.weightProvided || "",
      returnedWeight: product.returnedWeight || "",
      remainingWeight: product.weightLoss || "",
      userId: product.userId?._id || prev.userId,
      scrab: product.scrab ||"",

      // AUTO EXTRA MATERIAL SELECTION
      needExtraMaterial: hasExtra,
      material: hasExtra ? product.material : "",
      subCategory: hasExtra ? product.subCategory : "",
      childCategory: hasExtra ? product.childCategory : "",
      extraMaterialWeight: hasExtra ? product.extraMaterialWeight : "",
    }));
  }, [product]);

  /* ----------------------- CALCULATE REMAINING WEIGHT ----------------------- */
  // useEffect(() => {
  //   const w = sanitizeNumber(formData.weight);
  //   const r = sanitizeNumber(formData.returnedWeight);

  //   setFormData((prev) => ({
  //     ...prev,
  //     remainingWeight: w > 0 ? Math.max(w - r, 0) : 0,
  //   }));
  // }, [formData.weight, formData.returnedWeight]);

  /* ----------------------- SUBMIT ----------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateExtraMaterial()) {
      toast.error("Please fill required extra material fields");
      return;
    }

    const finalData = {
      weightProvided: Number(formData.weight),
      returnedWeight: Number(formData.returnedWeight),
      userId: formData.userId,
      scrab: formData.scrab,
      material: formData.needExtraMaterial ? formData.material : null,
      subCategory: formData.needExtraMaterial ? formData.subCategory : null,
      childCategory: formData.needExtraMaterial
        ? formData.childCategory
        : null,
      extraMaterialWeight: formData.needExtraMaterial
        ? Number(formData.extraMaterialWeight)
        : 0,
      product: productId,
    };

    try {
      const url = product
        ? `${backendRoute}${routes.updateProductRepair}${productId}`
        : `${backendRoute}${routes.createProductRepair}`;

      const method = product ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(finalData),
      });

      const data = await res.json();

      if (data.success) {
        if (data?.data?.returnedWeight !== undefined) {
          onProcessUpdated()
        }
        toast.success(product ? "Repair Updated!" : "Repair Added!");
      } else {
        toast.error(data.message || "Failed");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error");
    }
  };

  /* ----------------------- DROPDOWN VALUES ----------------------- */
  const subCategories = formData.material
    ? Object.keys(filteredMaterialData[formData.material] || {})
    : [];

  const childCategories =
    formData.material && formData.subCategory
      ? filteredMaterialData[formData.material][formData.subCategory] || []
      : [];

  /* ----------------------- UI ----------------------- */
  return (
    <div className="max-w-full mx-auto bg-white p-6 rounded-xl mt-5">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">
        {productId ? "Edit Repair" : "Repair Form"}
      </h2>
      <form className="space-y-5" onSubmit={handleSubmit}>

        {/* -------------------- MAIN INPUTS -------------------- */}
        <div className="grid md:grid-cols-3 gap-5">

          {productId && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Product ID</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                value={product?.productCode || ""}
                disabled
              />
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Weight Provided (grams)
            </label>
            <input
              type="number"
              disabled={!isEditable}
              className="w-full border rounded-lg px-3 py-2"
              value={formData.weight}
              onChange={(e) =>
                setFormData({ ...formData, weight: sanitizeNumber(e.target.value) })
              }
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Returned Weight (grams)
            </label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2"
              value={formData.returnedWeight}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  returnedWeight: sanitizeNumber(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Scrab (grams)
            </label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2"
              value={formData.scrab}
              onChange={(e) =>
                setFormData({ ...formData, scrab: sanitizeNumber(e.target.value) })
              }
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Weight Loss
            </label>
            <input
              type="number"
              disabled
              className="w-full border rounded-lg px-3 py-2 bg-gray-100"
              value={formData.remainingWeight}
            />
          </div>

          {showSelectUser && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Select User</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
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

        {/* -------------------- EXTRA MATERIAL -------------------- */}
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={formData.needExtraMaterial}
              onChange={() =>
                setFormData({
                  ...formData,
                  needExtraMaterial: !formData.needExtraMaterial,
                })
              }
            />
            Need Extra Material?
          </label>

          {formData.needExtraMaterial ? (
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              {/* MATERIAL */}
              <div>
                <label className="block text-sm">Material</label>
                <select
                  className={`w-full border px-3 py-2 rounded-lg ${errors.material ? "border-red-500" : ""
                    }`}
                  value={formData.material}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      material: e.target.value,
                      subCategory: "",
                      childCategory: "",
                    })
                  }
                >
                  <option value="">Select Material</option>
                  {Object.keys(filteredMaterialData).map((mat) => (
                    <option key={mat} value={mat}>
                      {mat}
                    </option>
                  ))}
                </select>
              </div>

              {/* SUB CATEGORY */}
              {subCategories.length > 0 && (
                <div>
                  <label className="block text-sm">Sub Category</label>
                  <select
                    className={`w-full border px-3 py-2 rounded-lg ${errors.subCategory ? "border-red-500" : ""
                      }`}
                    value={formData.subCategory}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subCategory: e.target.value,
                        childCategory: "",
                      })
                    }
                  >
                    <option value="">Select Sub Category</option>
                    {subCategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* CHILD CATEGORY */}
              {childCategories.length > 0 && (
                <div>
                  <label className="block text-sm">Child Category</label>
                  <select
                    className={`w-full border px-3 py-2 rounded-lg ${errors.childCategory ? "border-red-500" : ""
                      }`}
                    value={formData.childCategory}
                    onChange={(e) =>
                      setFormData({ ...formData, childCategory: e.target.value })
                    }
                  >
                    <option value="">Select Child Category</option>
                    {childCategories.map((child) => (
                      <option key={child} value={child}>
                        {child}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* EXTRA MATERIAL WEIGHT */}
              <div>
                <label className="block text-sm">
                  Extra Material Weight (grams)
                </label>
                <input
                  type="number"
                  className={`w-full border px-3 py-2 rounded-lg ${errors.extraMaterialWeight ? "border-red-500" : ""
                    }`}
                  value={formData.extraMaterialWeight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      extraMaterialWeight: sanitizeNumber(e.target.value),
                    })
                  }
                />
              </div>

            </div>
          ) : null}
        </div>

        <button
          type="submit"
          className="w-36 bg-[#3c3d3d] cursor-pointer text-white py-2 rounded-lg hover:bg-black"
        >
          {productId ? "Update Filing" : "Submit Filing"}
        </button>
      </form>
    </div>
  );
};

export default Repair;
