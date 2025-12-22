import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ProductionRoles } from "../../../helper/permissions";
import { backendRoute, routes } from "../../../backendUrl";
import { useAuth } from "../../../context/store";
import { Plus, Trash2, Save, Edit } from "lucide-react";
import { toast } from "react-toastify";
import ShapeDropdownPortal from "../../Popups/DropDown";
const sanitizeNumber = (num) => Math.max(0, Number(num) || 0);
/* -----------------------------
   Diamond → Category Structure
------------------------------ */
const MATERIAL_DATA = {
  Diamond: {
    "Natural Diamond": ["Round", "Oval", "Cushion", "Cushion Square", "Princess", "Pear", "Marquise", "Emerald", "Octagon", "Emerald Square", "Radiant", "Radiant Square", "Heart", "Trillian Curved", "Triangle", "trillian Straight", "Calf", "Half Moon", "Baguette Straight"],
    "Lab Stone": ["Round", "Oval", "Cushion", "Cushion Square", "Princess", "Pear", "Marquise", "Emerald", "Octagon", "Emerald Square", "Radiant", "Radiant Square", "Heart", "Trillian Curved", "Triangle", "trillian Straight", "Calf", "Half Moon", "Baguette Straight"],
    Mozonight: ["Round", "Oval", "Cushion", "Cushion Square", "Princess", "Pear", "Marquise", "Emerald", "Octagon", "Emerald Square", "Radiant", "Radiant Square", "Heart", "Trillian Curved", "Triangle", "trillian Straight", "Calf", "Half Moon", "Baguette Straight"],
    "Color Stone": ["Round", "Oval", "Cushion", "Cushion Square", "Princess", "Pear", "Marquise", "Emerald", "Octagon", "Emerald Square", "Radiant", "Radiant Square", "Heart", "Trillian Curved", "Triangle", "trillian Straight", "Calf", "Half Moon", "Baguette Straight"],
  },
};
const Setting = ({ onProcessUpdated }) => {
  const { productId } = useParams();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [product, setProduct] = useState(null);
  const wrapperRef = useRef(null);
  const portalRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    weight: "",
    returnedWeight: "",
    remainingWeight: "",
    userId: "",
    diamondCategory: "",
    diamondSubCategory: "",
    diamondChildCategory: [],
    diamondDetails: {},
    savedShapes: {},
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
      remainingWeight: product.weightLoss || "",
      userId: product.userId?._id || "",

      diamondCategory: product.diamondCategory || "",
      diamondSubCategory: product.diamondSubCategory || "",
      diamondChildCategory: product.diamondChildCategory || [],
      diamondDetails: product.diamondDetails || {},
      savedShapes: product.savedShapes || {}

    });
  }, [product]);

  //<--------------- fetched only saved details---------------------------->




  /* ----------------------------- 
     6️⃣ SUBMIT FORM 
  ------------------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log("form data is as----------> ", formData)

    const finalData = {
      product: productId,
      userId: formData.userId,
      material: "Diamond",
      weightProvided: Number(formData.weight),
      returnedWeight: Number(formData.returnedWeight),
      remainingWeight: formData.remainingWeight,
      diamondCategory: formData.diamondCategory,
      diamondSubCategory: formData.diamondSubCategory,
      diamondChildCategory: formData.diamondChildCategory,
      diamondDetails: JSON.stringify(formData.diamondDetails),
      savedShapes: JSON.stringify(formData.savedShapes)
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



        if (data?.data?.returnedWeight !== undefined) {

          onProcessUpdated()
        }
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

  const handleShapeToggle = (shape) => {
    setFormData((prev) => {
      const exists = prev.diamondChildCategory.includes(shape);

      // 🧹 REMOVE SHAPE
      if (exists) {
        const updatedDetails = { ...prev.diamondDetails };
        const updatedSavedShapes = { ...prev.savedShapes };

        delete updatedDetails[shape];
        delete updatedSavedShapes[shape]; // ❌ or keep false (your choice)

        return {
          ...prev,
          diamondChildCategory: prev.diamondChildCategory.filter(
            (s) => s !== shape
          ),
          diamondDetails: updatedDetails,
          savedShapes: {
            ...updatedSavedShapes,
            [shape]: false, // ✅ explicitly mark false on untoggle
          },
        };
      }

      // ➕ ADD SHAPE
      return {
        ...prev,
        diamondChildCategory: [...prev.diamondChildCategory, shape],
        diamondDetails: {
          ...prev.diamondDetails,
          [shape]: [{ dimension: "", pieces: "", weight: "" }],
        },
        savedShapes: {
          ...prev.savedShapes,
          [shape]: false, // ✅ default unsaved
        },
      };
    });
  };

  const handleSaveShape = (shape) => {
    const rows = formData.diamondDetails[shape] || [];

    // Basic validation
    const isValid = rows.every(
      (r) => r.dimension && r.pieces && r.weight
    );

    if (!isValid) {
      toast.error(`Please fill all fields for ${shape}`);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      savedShapes: {
        ...prev.savedShapes,
        [shape]: true,
      },
    }));

    toast.success(`${shape} saved`);
  };


  const updateDiamondRow = (shape, index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.diamondDetails[shape]];
      updated[index][field] = value;

      return {
        ...prev,
        diamondDetails: {
          ...prev.diamondDetails,
          [shape]: updated
        }
      };
    });
  };

  const addDiamondRow = (shape) => {
    setFormData((prev) => ({
      ...prev,
      diamondDetails: {
        ...prev.diamondDetails,
        [shape]: [...prev.diamondDetails[shape], { dimension: "", pieces: "", weight: "" }]
      }
    }));
  };

  const removeDiamondRow = (shape, index) => {
    setFormData((prev) => {
      const updated = prev.diamondDetails[shape].filter((_, i) => i !== index);

      return {
        ...prev,
        diamondDetails: {
          ...prev.diamondDetails,
          [shape]: updated
        }
      };
    });
  };
  const unlockShape = (shape) => {
    setFormData((prev) => ({
      ...prev,
      savedShapes: {
        ...prev.savedShapes,
        [shape]: false,
      },
    }));
  };


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
              Diamond
            </label>
            <select
              value={formData.diamondCategory}
              disabled={!isEditable}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  diamondCategory: e.target.value,
                  diamondSubCategory: "",
                  diamondChildCategory: [],
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
                Diamond Types
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
                disabled={!isEditable}
                className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:outline-none"
              >
                <option value="">-- Select Sub Category --</option>
                {subCats.map((sub) => (
                  <option key={sub}>{sub}</option>
                ))}
              </select>
            </div>
          )}

          {childCats.length > 0 && (
            <div ref={wrapperRef} className="relative w-full">
              <label className="block text-sm text-gray-600 mb-1">
                Diamond Shapes
              </label>
              <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-left"
              >
                {formData.diamondChildCategory.length
                  ? formData.diamondChildCategory.join(", ")
                  : "Select Shapes"}
              </button>

              {/* 🧱 Leaf node for portal */}
              <div ref={portalRef} className="relative" />

              {open && (
                <ShapeDropdownPortal
                  portalRef={portalRef}
                  childCats={childCats}
                  selected={formData.diamondChildCategory}
                  onToggle={handleShapeToggle}
                />
              )}
            </div>

          )}
          {Array.isArray(formData.diamondChildCategory) &&
            formData.diamondChildCategory.map((shape) => (
              <div
                key={shape}
                className={`border rounded-lg p-4 mt-4 ${formData.savedShapes?.[shape]
                  ? "bg-gray-200 border-gray-400"
                  : "bg-gray-50"
                  }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold">{shape} Details</h4>

                  {formData.savedShapes?.[shape] ? (
                    <button
                      type="button"
                      onClick={() => unlockShape(shape)}
                      className="text-sm text-yellow px-3 py-1 rounded cursor-pointer"
                    >
                      <Edit size={18} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSaveShape(shape)}
                      className="text-sm  text-black px-3 py-1 cursor-pointer rounded"
                    >
                      <Save size={18} />
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-4 gap-3 mb-2">
                  <p>Diams</p>
                  <p>Pacs</p>
                  <p>Wt</p>
                </div>
                {formData.diamondDetails[shape]?.map((row, index) => (
                  <div key={index} className="grid md:grid-cols-4 h-auto gap-3 mb-2">

                    <input
                      placeholder="Dimension"
                      value={row.dimension}
                      onChange={(e) =>
                        updateDiamondRow(shape, index, "dimension", e.target.value)
                      }
                      className="border rounded px-2 py-1 border-gray-300 focus:outline-none focus:border-gray-500"
                      disabled={formData.savedShapes?.[shape]}
                    />

                    <input
                      placeholder="Pieces"
                      type="number"
                      value={row.pieces}
                      onChange={(e) =>
                        updateDiamondRow(shape, index, "pieces", e.target.value)
                      }
                      className="border rounded px-2 py-1 border-gray-300 focus:outline-none focus:border-gray-500"
                      disabled={formData.savedShapes?.[shape]}
                    />

                    <input
                      placeholder="Weight"
                      type="number"
                      value={row.weight}
                      onChange={(e) =>
                        updateDiamondRow(shape, index, "weight", e.target.value)
                      }
                      className="border rounded px-2 py-1 border-gray-300 focus:outline-none focus:border-gray-500"
                      disabled={formData.savedShapes?.[shape]}
                    />

                    {!formData.savedShapes?.[shape] && (
                      <button
                        type="button"
                        onClick={() => removeDiamondRow(shape, index)}
                        className="text-red-500 cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}

                {!formData.savedShapes?.[shape] && (
                  <button
                    type="button"
                    onClick={() => addDiamondRow(shape)}
                    className="text-sm text-black mt-2 cursor-pointer"
                  >
                    <Plus size={18} />
                  </button>
                )}
              </div>
            ))}





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
              disabled={!isEditable}
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
          className="w-36 bg-[#3c3d3d] cursor-pointer text-white py-2 rounded-lg hover:bg-black"
        >
          {productId ? "Update Setting" : "Submit Setting"}
        </button>
      </form>
    </div>
  );
};

export default Setting;
