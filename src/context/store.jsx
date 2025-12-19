import { createContext, useContext, useEffect, useState } from "react";
import { backendRoute, routes } from "../backendUrl";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const getUser = async () => {
  const res = await fetch(`${backendRoute}${routes.verifyToken}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = new Error("Unauthorized");
    error.status = res.status;
    throw error;
  }

  return await res.json();
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Auto load user
  useEffect(() => {
    getUser()
      .then(res => setUser(res.user))
      .catch(() => setUser(null));
  }, []);

  // ✅ Logout
  const logout = async () => {
    const res = await fetch(`${backendRoute}${routes.logout}`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (data?.success) {
      toast.success(data.message);
      setUser(null);
      navigate("/");
    } else {
      toast.error("Something went wrong");
    }
  };

  // ✅ Auto logout on 401
  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.status === 401) logout();
    };

    window.addEventListener("authError", handler);
    return () => window.removeEventListener("authError", handler);
  }, []);

  // ✅ Re-fetch user after login / impersonation / exit
  useEffect(() => {
    const handler = async () => {
      try {
        const res = await getUser();
        setUser(res.user);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("userLoggedIn", handler);
    return () => window.removeEventListener("userLoggedIn", handler);
  }, []);

  // 🔥 NEW: Exit impersonation
  const exitImpersonation = async () => {
    const res = await fetch(
      `${backendRoute}${routes.exitImpersonateAdmin}`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (data?.success) {
      window.dispatchEvent(new Event("userLoggedIn"));
      toast.success("Returned to your panel");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        logout,
        exitImpersonation,
        getUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
