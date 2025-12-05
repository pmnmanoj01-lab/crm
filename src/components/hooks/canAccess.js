// src/hooks/useAccess.js
import { useAuth } from "../../context/store";

export  function useAccess() {
  const { user } = useAuth();

  const can = (feature, action) => {
    if (!user?.access) return false;
     if(user.role==="admin") return true
    const featureAccess = user.access.find(a => a.feature === feature);
    if (!featureAccess) return false;
    // If only feature check (feature exists)
    if (action === undefined) return true;
    return featureAccess.permission.includes(action);
  };

  return { can };
}
