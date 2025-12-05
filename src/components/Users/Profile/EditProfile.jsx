// frontend/src/pages/EditEmployee.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { backendRoute, routes } from "../../../backendUrl";
import { useAuth } from "../../../context/store";

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
        Casting: ["Manager","Dia Casting", "Metal Casting"],
        Production: ["Manager","Filing", "Setting", "Pre Polish", "Polish", "Repair"],
        HR: ["HR Executive", "Recruiter", "HR Manager"]
    };

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const {user,setUser,getUser}=useAuth()
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    subCategory: "",
    password: ""
  });

  // ===========================
  // GET USER DATA
  // ===========================
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${backendRoute}${routes.getSingleUser}${id}`, {
          method: "GET",
          credentials:"include"
        });

        const data = await res.json();

        // console.log("load data is as------------> ",data)

        if (!res.ok) {
          toast.error(data.message || "Failed to load user");
          return navigate(-1);
        }

        const user = data.user;

        setForm({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          category: user.category || "",
          subCategory: user.role || "",
          password: ""
        });

      } catch (err) {
        console.error(err);
        toast.error("Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [id, navigate]);

  // ===========================
  // HANDLE INPUT
  // ===========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === "category") {
      setForm((prev) => ({ ...prev, subCategory: "" }));
    }
  };

  // ===========================
  // UPDATE USER
  // ===========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.category || !form.subCategory) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      const body = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        category: form.category,
        role: form.subCategory
      };

      if (form.password) body.password = form.password;

      const res = await fetch(`${backendRoute}${routes.updateUser}${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials:"include"
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Update failed");
        return;
      }
      getUser().then(res => { setUser(res.user);console.log("editted user--------> ",user) }).catch(err => setUser(null))
      toast.success(data.message || "User updated successfully");
      navigate("/dashboard/profile");

    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
        <div className="flex justify-between">
             <h2 className="text-xl font-semibold mb-4">Edit Employee</h2>
            <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-4 py-2 border border-gray-300 hover:focus:border-gray-500 cursor-pointer rounded-md hover:bg-gray-100"
                >
                    Back
                </button>
        </div>
     

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Name */}
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:outline-none focus:border-gray-500 rounded px-3 py-2"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border  border-gray-300 focus:outline-none focus:border-gray-500 rounded px-3 py-2"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border  border-gray-300 focus:outline-none focus:border-gray-500 rounded px-3 py-2"
            />
          </div>

          {/* Category */}
         {((user.role==="admin")||(user.category==="Manager"))&& <div>
            <label className="block text-sm mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border  border-gray-300 focus:outline-none focus:border-gray-500 rounded px-3 py-2"
            >
              <option value="">Select</option>
              {Object.keys(categoryOptions).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>}

          {/* Sub Category */}
          {((user.role==="admin")||(user.category==="Manager"))&&form.category && (
            <div>
              <label className="block text-sm mb-1">Role / Sub Category</label>
              <select
                name="subCategory"
                value={form.subCategory}
                onChange={handleChange}
                className="w-full border  border-gray-300 focus:outline-none focus:border-gray-500 rounded px-3 py-2"
              >
                <option value="">Select role</option>
                {categoryOptions[form.category].map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          )}

          {/* Password */}
          {((user.role==="admin")||(user.category==="Manager"))&&<div className="relative">
            <label className="block text-sm mb-1">Password (leave blank to keep)</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              className="w-full border  border-gray-300 focus:outline-none focus:border-gray-500 rounded px-3 py-2"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            disabled={loading}
            className="px-4 py-2 bg-[#3c3d3d] cursor-pointer text-white rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border cursor-pointer rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
