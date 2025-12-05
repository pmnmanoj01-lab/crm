import { createContext, useContext, useEffect, useState } from "react";
import { backendRoute, routes } from "../backendUrl";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
const getUser = async () => {
  const data = await fetch(`${backendRoute}${routes.verifyToken}`, {
    method: "GET",
    credentials: "include",   // 🔥 MUST BE HERE
  })
  return await data.json()
}
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

 const navigate=useNavigate()

  // 1. Auto load authenticated user
  useEffect(() => {
    getUser().then(res => { setUser(res.user) }).catch(err => setUser(null))

  }, []);

  

  const logout = async () => {
    const res = await fetch(`${backendRoute}${routes.logout}`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json()

    
    if (data?.success) {
      toast.success(data.message)
      setUser(null);
      navigate("/");
    }
    else {
      toast.error("something went wrong")
    }

  };

  // ⛔ AUTO LOGOUT when token expires (401)
  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.status === 401) {
        logout();
      }
    };

    window.addEventListener("authError", handler);
    return () => window.removeEventListener("authError", handler);
  }, []);

  useEffect(() => {
  const handler = async () => {
    try {
      const res = await getUser();
      setUser(res.user);
    } catch (err) {
      setUser(null);
    }
  };

  window.addEventListener("userLoggedIn", handler);
  return () => window.removeEventListener("userLoggedIn", handler);
}, []);


  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user,setUser, isAuthenticated, logout,getUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
