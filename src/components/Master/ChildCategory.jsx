import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import { toast } from "react-toastify";
import { backendRoute, routes } from "../../backendUrl";
import CategoryShimmer from "./CategoryShimmer";
import EmptyState from "./EmptyState";

/* ---------- API ---------- */
const getAllChildCategories = async (categoryId) => {
    const res = await fetch(
        `${backendRoute}${routes.getMasterSubChildCategories}?subCategory=${categoryId}`,
        { method: "GET", credentials: "include" }
    );
    const data = await res.json();
    return data?.data || [];
};

const ChildCategory = ({ category, subCategory }) => {
    const [childCategory, setChildCategory] = useState("");
    const [childCategories, setChildCategories] = useState([]);
    const [selectedChildCategory, setSelectedChildCategory] = useState(null);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);

    /* ---------- Load ---------- */
    useEffect(() => {
        if (subCategory) {
            fetchChildCategories(subCategory);
        }
    }, [subCategory]);

    const fetchChildCategories = async (categoryId) => {
        try {
            setLoading(true);
            const res = await getAllChildCategories(categoryId);
            setChildCategories(Array.isArray(res) ? res : []);
        } catch (error) {
            console.error(error);
            setChildCategories([]);
        } finally {
            setLoading(false);
        }
    };

    /* ---------- Add / Update ---------- */
    const addOrUpdateChildCategory = async () => {
        if (!childCategory.trim()) return;

        try {
            setLoading(true);
            const isEdit = editId !== null;

            const url = isEdit
                ? `${backendRoute}${routes.editMasterSubChildCategory}${editId}`
                : `${backendRoute}${routes.addMasterSubChildCategory}`;

            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    category,
                    childCategory,
                    subCategory
                }),
                credentials: "include",
            });

            const data = await res.json();
            if (!res.ok) return toast.error(data?.message);

            toast.success(data?.message);
            setChildCategory("");
            setEditId(null);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            await fetchChildCategories(subCategory);
            setLoading(false);
        }
    };

    /* ---------- Edit ---------- */
    const editChildCategory = (id) => {
        const item = childCategories.find((cc) => cc._id === id);
        if (!item) return;

        setChildCategory(item.name);
        setEditId(item._id);
    };

    /* ---------- Delete ---------- */
    const deleteChildCategory = async (id) => {
        try {
            setLoading(true);
            const res = await fetch(
                `${backendRoute}${routes.deleteMasterSubChildCategory}${id}`,
                { method: "DELETE", credentials: "include" }
            );

            const data = await res.json();
            if (!res.ok) return toast.error(data?.message);

            toast.success(data?.message);
            setEditId(null);
            setChildCategory("");
            setSelectedChildCategory(null);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            await fetchChildCategories(subCategory);
            setLoading(false);
        }
    };

    /* ---------- UI ---------- */
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            {/* Input */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 w-full">
                    <label className="font-medium text-gray-700">
                        Jewellery Child Category :
                    </label>

                    <input
                        value={childCategory}
                        onChange={(e) => setChildCategory(e.target.value)}
                        placeholder={editId ? "Update child category" : "Enter child category"}
                        className="flex-1 border rounded-lg px-3 py-2 border-gray-300 focus:outline-none focus:border-gray-500"
                    />
                </div>

                <button
                    onClick={addOrUpdateChildCategory}
                    className="ml-3 bg-black text-white p-2 rounded-full hover:bg-gray-800 cursor-pointer"
                >
                    {editId ? <Save size={18} /> : <Plus size={18} />}
                </button>
            </div>

            <hr className="mb-4 border-gray-300" />

            {/* List */}
            <div className="space-y-2">
                {loading && <CategoryShimmer />}

                {!loading && childCategories.length === 0 && (
                    <EmptyState message="No child categories available" />
                )}

                {!loading &&
                    childCategories.length > 0 &&
                    childCategories.map((item) => (
                        <div
                            key={item._id}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg ${selectedChildCategory === item._id ? "bg-gray-100" : ""
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-gray-800">{item?.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => editChildCategory(item._id)}
                                    className="text-gray-700 hover:text-indigo-600 cursor-pointer"
                                >
                                    <Edit size={18} />
                                </button>

                                <button
                                    onClick={() => deleteChildCategory(item._id)}
                                    className="text-gray-700 hover:text-red-600 cursor-pointer"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ChildCategory;
