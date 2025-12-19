import React, { useMemo, useState, useEffect } from "react";
import { Eye, Edit, Trash2, PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 5;

const CATEGORIES = ["All", "Ring", "Necklace", "Bracelet", "Earring", "Pendant"];

/* -----------------------------
   Dummy Design Products
------------------------------ */
const INITIAL_PRODUCTS = [
    {
        id: 1,
        styleNo: "RNG-1001",
        category: "Ring",
        metalWeight: 12.5,
        diamondCt: 0.75,
        totalDiamond: 24,
    },
    {
        id: 2,
        styleNo: "NK-2045",
        category: "Necklace",
        metalWeight: 45.2,
        diamondCt: 2.15,
        totalDiamond: 110,
    },
    {
        id: 3,
        styleNo: "BR-3321",
        category: "Bracelet",
        metalWeight: 18.8,
        diamondCt: 1.1,
        totalDiamond: 56,
    },
    {
        id: 4,
        styleNo: "ER-7789",
        category: "Earring",
        metalWeight: 9.6,
        diamondCt: 0.65,
        totalDiamond: 18,
    },
    {
        id: 5,
        styleNo: "PD-9912",
        category: "Pendant",
        metalWeight: 7.3,
        diamondCt: 0.4,
        totalDiamond: 12,
    },
    {
        id: 6,
        styleNo: "RNG-1008",
        category: "Ring",
        metalWeight: 13.1,
        diamondCt: 0.85,
        totalDiamond: 30,
    },
];

const DesignProductList = () => {
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [category, setCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    /* -----------------------------
       Filter
    ------------------------------ */
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchCategory =
                category === "All" || p.category === category;

            const matchSearch = p.styleNo
                .toLowerCase()
                .includes(search.toLowerCase());

            return matchCategory && matchSearch;
        });
    }, [products, category, search]);

    /* -----------------------------
       Pagination
    ------------------------------ */
    const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);

    const paginatedData = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredProducts.slice(start, start + PAGE_SIZE);
    }, [filteredProducts, page]);

    useEffect(() => {
        setPage(1);
    }, [category, search]);

    /* -----------------------------
       Actions
    ------------------------------ */
    const handleView = (product) => {
        console.log("View", product);
    };

    const handleEdit = (product) => {
        console.log("Edit", product);
    };

    const handleDelete = (id) => {
        if (!window.confirm("Delete this design product?")) return;
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">

            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold"> Design Lists</h2>

                <button
                    onClick={() => navigate("/dashboard/designer/create-product")}
                    className="flex items-center cursor-pointer gap-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
                >
                    <PlusCircle size={16} />
                    Add Design
                </button>
            </div>




            {/* FILTERS */}
            <div className="flex flex-wrap gap-3 items-center">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border px-3 py-2 rounded text-sm"
                >
                    {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Search by Style No"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-3 py-2 rounded text-sm w-60"
                />
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 text-sm">
                    <thead className="bg-gray-100 border border-gray-200">
                        <tr>
                            <th className="p-3 text-start ">Style No</th>
                            <th className="p-3 text-start ">Category</th>
                            <th className="p-3 text-start">Metal Wt</th>
                            <th className="p-3 text-start">Dia Ct</th>
                            <th className="p-3 text-start">Total Dia</th>
                            <th className="p-3  text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedData.length ? (
                            paginatedData.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 border border-gray-200">
                                    <td className="p-3 ">{p.styleNo}</td>
                                    <td className="p-3 ">{p.category}</td>
                                    <td className="p-3 ">{p.metalWeight}</td>
                                    <td className="p-3 ">{p.diamondCt}</td>
                                    <td className="p-3 ">{p.totalDiamond}</td>

                                    <td className="p-2 ">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                title="View"
                                                onClick={() => handleView(p)}
                                                className="text-blue-600 cursor-pointer hover:text-blue-800"
                                            >
                                                <Eye size={16} />
                                            </button>

                                            <button
                                                title="Edit"
                                                onClick={() => handleEdit(p)}
                                                className="text-green-600 cursor-pointer hover:text-green-800"
                                            >
                                                <Edit size={16} />
                                            </button>

                                            <button
                                                title="Delete"
                                                onClick={() => handleDelete(p.id)}
                                                className="text-red-600 cursor-pointer hover:text-red-800"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-4 text-center text-gray-500">
                                    No products found
                                </td>
                            </tr>
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
                    {Array.from({ length: totalPages }).map((_, idx) => {
                        const p = idx + 1;
                        return (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`px-2 py-1 border border-gray-300 rounded 
                                    ${p === page ? "bg-gray-800 text-white" : ""}`}
                            >
                                {p}
                            </button>
                        );
                    })}


                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className="border px-3 py-2 rounded border-gray-300 hover:border-gray-400 cursor-pointer"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

        </div>
    );
};

export default DesignProductList;
