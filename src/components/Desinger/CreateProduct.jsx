import { useState } from "react";
import { X } from "lucide-react";
import { backendRoute, routes } from "../../backendUrl";
import { useEffect } from "react";
const getAllCategories = async () => {
    const res = await fetch(`${backendRoute}${routes.getMasterCategories}`, { method: "GET", credentials: "include" })
    const data = await res.json()
    return data.data || []
}
const CreateDesignProduct = () => {
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([])
    const [images, setImages] = useState([]);
    const [cadImage, setCadImage] = useState();
    const [formData, setFormData] = useState({
        metalWeight: "",
        diamondCt: "",
        totalDiamond: "",
    });
    useEffect(() => {
        fetchCategories()
    }, [])
    const fetchCategories = async () => {
        try {

            const res = await getAllCategories();
            setCategories(Array.isArray(res) ? res : []);
        } catch (error) {
            console.error(error);
            setCategories([]);
        }
    };
    /* -----------------------------
       Handle Input Change
    ------------------------------ */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    /* -----------------------------
       Handle Image Selection
    ------------------------------ */
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (images.length + files.length > 3) {
            alert("You can upload only 3 images");
            return;
        }

        const validImages = files.filter((file) =>
            file.type.startsWith("image/")
        );

        const mapped = validImages.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setImages((prev) => [...prev, ...mapped]);
        e.target.value = "";
    };
    const handleCadImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // validate image
        if (!file.type.startsWith("image/")) {
            toast.error("Only image files are allowed");
            e.target.value = "";
            return;
        }

        // cleanup old preview (important)
        setCadImage((prev) => {
            prev?.[0]?.preview && URL.revokeObjectURL(prev[0].preview);

            return [
                {
                    file,
                    preview: URL.createObjectURL(file),
                },
            ];
        });

        // reset input so same file can be selected again
        e.target.value = "";
    };


    /* -----------------------------
       Remove Image
    ------------------------------ */
    const removeImage = (index) => {
        URL.revokeObjectURL(images[index].preview);
        setImages(images.filter((_, i) => i !== index));
    };
    const removeCadImage = (index) => {
        URL.revokeObjectURL(cadImage[index].preview);
        setCadImage(cadImage.filter((_, i) => i !== index));
    };

    /* -----------------------------
       Submit (placeholder)
    ------------------------------ */
    const handleSubmit = async () => {
          const payload = {
            category,
            ...formData,
            images,
            cadImage
        };

        // const formData1 = new FormData();

        // text fields
        // formData1.append("category", category);
        // formData1.append("metalWeight",formData.metalWeight);
        // formData1.append("diamondCt", formData.diamondCt);
        // formData1.append("totalDiamond",formData.totalDiamond);

        // multiple product images
        // images.forEach((img) => {
        //     formData1.append("images", img.file); // same key = array
        // });

        // // single CAD image
        // if (cadImage?.[0]?.file) {
        //     formData1.append("cadImage", cadImage[0].file);
        // }

        // const res = await fetch(`${backendRoute}${routes.addProduct}`, {
        //     method: "POST",
        //     body: formData1, // ❌ no headers
        //     credentials: "include",
        // });

        // const data = await res.json();
        console.log(payload);
    };

    return (
        <div className="max-w-5xl bg-white rounded-lg shadow p-6 space-y-3">
            <h2 className="text-lg font-semibold">Create Design Product</h2>
            <div className="grid md:grid-cols-2 gap-5">
                {/* CATEGORY */}

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Category
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border rounded focus:outline-none border-gray-300 focus:border-gray-500 px-3 py-2"
                    >
                        <option value="">Select category</option>
                        {categories.map((cat, i) => (
                            <option key={i} value={cat?._id}>
                                {cat?.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* METAL WEIGHT */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Metal Weight (gm)
                    </label>
                    <input
                        type="number"
                        name="metalWeight"
                        value={formData.metalWeight}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        placeholder="Eg: 12.35"
                        className="w-full border focus:outline-none border-gray-300 focus:border-gray-500 rounded px-3 py-2"
                    />
                </div>

                {/* DIAMOND CT */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Diamond Ct
                    </label>
                    <input
                        type="number"
                        name="diamondCt"
                        value={formData.diamondCt}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        placeholder="Eg: 0.75"
                        className="w-full border focus:outline-none border-gray-300 focus:border-gray-500 rounded px-3 py-2"
                    />
                </div>

                {/* TOTAL DIAMOND */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Total Diamond Count
                    </label>
                    <input
                        type="number"
                        name="totalDiamond"
                        value={formData.totalDiamond}
                        onChange={handleChange}
                        min="0"
                        placeholder="Eg: 24"
                        className="w-full border focus:outline-none border-gray-300 focus:border-gray-500 rounded px-3 py-2"
                    />
                </div>
            </div>
            {/* IMAGE UPLOAD */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Upload Cad Image
                </label>

                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleCadImageChange}
                    className="w-full text-sm cursor-pointer "
                />

                {/* PREVIEW */}
                {cadImage?.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mt-3">
                        {cadImage?.map((img, index) => (
                            <div
                                key={index}
                                className="relative border border-gray-300 rounded overflow-hidden"
                            >
                                <img
                                    src={img.preview}
                                    alt="preview"
                                    className="h-36 w-full object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={() => removeCadImage(index)}
                                    className="absolute top-1 right-1 bg-black/60 text-white cursor-pointer rounded-full p-1"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">
                    Design Images (Max 3)
                </label>

                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={images.length >= 4}
                    className="w-full text-sm cursor-pointer "
                />

                {/* PREVIEW */}
                {images.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mt-3">
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className="relative border border-gray-300 rounded overflow-hidden"
                            >
                                <img
                                    src={img.preview}
                                    alt="preview"
                                    className="h-36 w-full object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-black/60 text-white cursor-pointer rounded-full p-1"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* SUBMIT */}
            <button
                onClick={handleSubmit}
                disabled={!category || images.length === 0}
                className="w-full bg-gray-600 cursor-pointer text-white py-2 rounded hover:bg-gray-900 "
            >
                Save Design Product
            </button>
        </div>
    );
};

export default CreateDesignProduct;
