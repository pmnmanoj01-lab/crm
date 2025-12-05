import {useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { backendRoute, routes } from "../backendUrl";
export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");   // 🔥 Clear old error

  try {
    const res = await fetch(`${backendRoute}${routes.login}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Login failed");
      setLoading(false);
      return;
    }

    // SUCCESS 🎉
    toast.success(data.message);
    window.dispatchEvent(new Event("userLoggedIn"));
    setError("");     // 🔥 Clear error on success
    setLoading(false);
    navigate("/dashboard"); // redirect
  } catch (err) {
    setError("Server error");
    setLoading(false);
  }
};




  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h2>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-center">{error}</p>
        )}

        <form className="space-y-2" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-[#3c3d3d]"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-[#3c3d3d]"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </div>

        
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3c3d3d] text-white py-3 mt-7 rounded-md hover:bg-[#000000] transition disabled:bg-[#000000]"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
