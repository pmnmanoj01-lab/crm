import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import { toast } from "react-toastify";
import { backendRoute, routes } from "../../backendUrl";
import CategoryShimmer from "./CategoryShimmer";
import EmptyState from "./EmptyState";
import ChildCategory from "./ChildCategory";
/* ---------- API ---------- */
const getAllSubCategories = async (category) => {
  const res = await fetch(
    `${backendRoute}${routes.getMasterSubCategories}?category=${category}`,
    { method: "GET", credentials: "include" }
  );
  const data = await res.json();
  return data.data || [];
};

const SubCategory = ({ category }) => {
  const [subCategory, setSubCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false)
  /* ---------- Load ---------- */
  useEffect(() => {
    if(category){
      fetchSubCategories(category)
    }
  }, [category]);

  const fetchSubCategories = async (category) => {
        try {
            setLoading(true);
            const res = await getAllSubCategories(category);
            setSubCategories(Array.isArray(res) ? res : []);
        } catch (error) {
            console.error(error);
            setSubCategories([]);
        } finally {
            setLoading(false);
        }
    };

  /* ---------- Add / Update ---------- */
  const addOrUpdateSubCategory = async () => {
    if (!subCategory.trim()) return;
    try {
      setLoading(true)
      const isEdit = editId !== null;
      const url = isEdit
        ? `${backendRoute}${routes.editMasterSubCategory}${editId}`
        : `${backendRoute}${routes.addMasterSubCategory}`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, subCategory }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data?.message);
      toast.success(data?.message);
      setSubCategory("");
      setEditId(null);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
    finally{
      await fetchSubCategories(category)
      setLoading(false)
    }
  };

  /* ---------- Edit ---------- */
  const editSubCategory = (id) => {
    const item = subCategories.find(sc => sc._id === id);
    if (!item) return;

    setSubCategory(item.name);
    setEditId(item._id);
  };

  /* ---------- Delete ---------- */
  const deleteSubCategory = async (id) => {
    try {
      setLoading(true)
      const res = await fetch(
        `${backendRoute}${routes.deleteMasterSubCategory}${id}`,
        { method: "DELETE", credentials: "include" }
      );

      const data = await res.json();

      if (!res.ok) return toast.error(data?.message);

      toast.success(data?.message);
      setEditId(null);
      setSubCategory("");
      setSelectedSubCategory(null);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
    finally{
      setLoading(false)
      await fetchSubCategories(category)
    }
  };

  /* ---------- UI ---------- */
  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6">
        {/* Input */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 w-full">
            <label className="font-medium text-gray-700">
              Jewellery Sub Category :
            </label>

            <input
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              placeholder={editId ? "Update sub category" : "Enter sub category"}
              className="flex-1 border rounded-lg px-3 py-2 border-gray-300 focus:outline-none focus:border-gray-500"
            />
          </div>

          <button
            onClick={addOrUpdateSubCategory}
            className="ml-3 bg-black text-white p-2 rounded-full hover:bg-gray-800 cursor-pointer"
          >
            {editId ? <Save size={18} /> : <Plus size={18} />}
          </button>
        </div>

        <hr className="mb-4 border-gray-300" />

        {/* List */}
        <div className="space-y-2">
          {


          }
          {loading && <CategoryShimmer />}
          {!loading && subCategories.length === 0 && <EmptyState message="No subcategories available" />}
          {!loading && subCategories.length > 0 &&
            Array.isArray(subCategories) && subCategories?.map((item) => (
              <div
                key={item._id}
                className={`flex items-center justify-between px-3 py-2 rounded-lg ${selectedSubCategory === item._id ? "bg-gray-100" : ""
                  }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={selectedSubCategory === item._id}
                    className="cursor-pointer"
                    onChange={() => setSelectedSubCategory(item._id)}
                  />
                  <span className="text-gray-800">{item.name}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => editSubCategory(item._id)}
                    className="text-gray-700 hover:text-indigo-600 cursor-pointer"
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={() => deleteSubCategory(item._id)}
                    className="text-gray-700 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          }

        </div>
      </div>
      {selectedSubCategory&&<ChildCategory category={category} subCategory={selectedSubCategory}/>}
    </>
  );
};

export default SubCategory;
