import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";   // ← ADD THIS
import { backendRoute, routes } from "../../backendUrl";

const CreateEmployee = () => {
    const [showPassword, setShowPassword] = useState(false);

    const categoryOptions = {
        Developement: ["Manager",
            "Frontend Developer", "Backend Developer", "Full Stack Developer",
            "DevOps Engineer", "App Development", "MERN Stack Developer",
            "PHP Developer", "MEAN Stack Developer"
        ],
        Designer: ["Manager","Cade Designer", "Graphic Designer", "Website Designer"],  // removed extra comma
        Marketing: ["Manager","Sales Marketing", "Social Media Marketing", "Digital Marketing"],
        Manager: [
            "Manager", 
        ],
        Production: ["Manager","Casting","Filing", "Setting", "Pre Polish", "Polish", "Repair"],
        HR: ["HR Executive", "Recruiter", "HR Manager"]
    };

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        category: "",
        subCategory: "",
        password: ""
    });

    const mobileRegex = /^[6-9]\d{9}$/;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({ ...form, [name]: value });

        if (name === "category") {
            setForm((prev) => ({ ...prev, subCategory: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // VALIDATION
        if (!form.name || !form.email || !form.phone || !form.category || !form.subCategory || !form.password) {
            toast.error("Please fill all fields");
            return;
        }

        if (!mobileRegex.test(form.phone)) {
            toast.error("Invalid mobile number. Must be 10 digits starting with 6-9.");
            return;
        }

        try {
            const response = await fetch(`${backendRoute}${routes.createUser}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    category: form.category,
                    role: form.subCategory,  // backend expects role
                    password: form.password
                }),
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Something went wrong");
                return;
            }

            toast.success("Employee Created Successfully!");
            console.log("Success:", data);

            // Reset form after success
            setForm({
                name: "",
                email: "",
                phone: "",
                category: "",
                subCategory: "",
                password: ""
            });

        } catch (error) {
            console.error(error);
            toast.error("Server error! Please try again.");
        }
    };

    return (
        <div className="w-full max-w-5xl mx-5 bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between">
                <h2 className="text-xl font-semibold mb-4">Create Employee</h2>
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                    Back
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Enter name"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Enter email"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Enter phone"
                        />
                    </div>

                    {/* Password */}
                    <div className="w-full relative">
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Type password here"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-11 -translate-y-1/2 text-gray-600 hover:text-black"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Team Category</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="">Select Category</option>
                            {Object.keys(categoryOptions).map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sub Category */}
                    {form.category && (
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Role / Sub Category
                            </label>
                            <select
                                name="subCategory"
                                value={form.subCategory}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            >
                                <option value="">Select Role</option>
                                {categoryOptions[form.category].map((sub, idx) => (
                                    <option key={idx} value={sub}>
                                        {sub}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#3c3d3d] text-white rounded py-2 hover:bg-black"
                >
                    Create Employee
                </button>
            </form>
        </div>
    );
};

export default CreateEmployee;
