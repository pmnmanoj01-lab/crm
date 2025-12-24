import { useState } from "react";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import SubCategory from "./SubCategory";
import { toast } from "react-toastify"
import { backendRoute, routes } from "../../backendUrl";
import { useEffect } from "react";
import CategoryShimmer from "./CategoryShimmer";
import EmptyState from "./EmptyState";
const getAllCategories = async () => {
    const res = await fetch(`${backendRoute}${routes.getMasterCategories}`, { method: "GET", credentials: "include" })
    const data = await res.json()
    return data.data || []
}
const Master = () => {
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        fetchCategories()
    }, [])
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await getAllCategories();
            setCategories(Array.isArray(res) ? res : []);
        } catch (error) {
            console.error(error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };
    const addOrUpdateCategory = async () => {

        if (!category.trim()) return;
        if (editIndex !== null) {
            try {
                setLoading(true)
                const res = await fetch(`${backendRoute}${routes.editMasterCategory}${editIndex}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ category }),
                    credentials: "include"
                })
                const data = await res.json()
                if (res?.ok) {
                    setCategory("");
                    setEditIndex(null);
                    toast.success(data?.message)
                }
                else {
                    toast.error(data?.message)
                }

            } catch (error) {
                console.log("error is as--> ", error)
                toast.error("something went wrong in frontend")
            }
            finally {
                await fetchCategories()
                setLoading(false)
            }
        } else {
            try {
                setLoading(true)
                const res = await fetch(`${backendRoute}${routes.addMasterCategory}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ category }),
                    credentials: "include"
                })
                const data = await res.json()
                if (res?.ok) {
                    setCategory("");
                    toast.success(data?.message)
                }
                else {
                    toast.error(data?.message)
                }

            } catch (error) {
                console.log("error is as--> ", error)
                toast.error("something went wrong in frontend")
            }
            finally {
                await fetchCategories()
                setLoading(false)
            }
        }

    };

    const editCategory = (id) => {
        const categoryToEdit = categories?.find(
            item => item?._id?.toString() === id.toString()
        );
        if (!categoryToEdit) return;
        setCategory(categoryToEdit?.name);
        setEditIndex(categoryToEdit?._id);
    };

    const deleteCategory = async (index) => {

        try {
            setLoading(true)
            const res = await fetch(`${backendRoute}${routes.deleteMasterCategory}${index}`, {
                method: "DELETE",
                credentials: "include"
            })
            const data = await res.json()
            if (res?.ok) {
                setCategory("");
                setEditIndex(null);
                setSelectedCategory(null);
                toast.success(data?.message)

            }
            else {
                setSelectedCategory(null);
                toast.error(data?.message)
            }

        } catch (error) {
            console.log("error is as--> ", error)
            setSelectedCategory(null);
            toast.error("something went wrong in frontend")
        }
        finally {
            await fetchCategories()
            setLoading(false)
        }
    };
    return (
        <>
            <h1 className="my-3 font-semibold text-2xl">Add Master Features</h1>
            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 items-start">
                <div className=" bg-white rounded-xl shadow-md p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 w-full">
                            <label className="font-medium text-gray-700">
                                Jewellery Category :
                            </label>
                            <input
                                value={category || ""}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder={editIndex !== null ? "update Category" : "Enter category"}
                                className="flex-1 border rounded-lg px-3 py-2 border-gray-300 focus:outline-none focus:border-gray-500"
                            />
                        </div>

                        <button
                            onClick={addOrUpdateCategory}
                            className="ml-3 bg-black text-white p-2 rounded-full hover:bg-gray-800 cursor-pointer"
                        >
                            {editIndex !== null ? <Save size={18} /> : <Plus size={18} />}
                        </button>
                    </div>

                    <hr className="mb-4 border-gray-300" />

                    {/* Listing */}
                    <div className="space-y-2">
                        {!loading && categories.length > 0 &&
                            Array.isArray(categories) && categories?.map((item, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg ${selectedCategory === item?._id ? "bg-gray-100" : ""
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            checked={selectedCategory === item?._id}
                                            onChange={() => { setSelectedCategory(item?._id) }}
                                        />
                                        <span className="text-gray-800">{item?.name}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => editCategory(item?._id)}
                                            className="text-gray-700 hover:text-indigo-600 cursor-pointer"
                                        >
                                            <Edit size={18} />
                                        </button>

                                        <button
                                            onClick={() => deleteCategory(item?._id)}
                                            className="text-gray-700 hover:text-red-600 cursor-pointer"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                        {loading && <CategoryShimmer />}
                        {!loading && categories.length === 0 && <EmptyState message="No categories available" />}
                    </div>
                </div>
                {selectedCategory && <SubCategory category={selectedCategory} />}
            </div>
        </>
    );
};

export default Master;
