import { useEffect, useState } from "react";
import QuickActions from "./Dashboard/QuickActions";
import RecentActivity from "./Dashboard/RecentActivity";
import StatsCard from "./Dashboard/StatsCard";
import UsersPanel from "./Dashboard/UsersPanel";
import { toast } from "react-toastify";
import {backendRoute, routes } from "../backendUrl";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalManagers: 0,
    totalEmployees: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch(
        `${backendRoute}${routes.getDashboardStatsData}`,
        { credentials: "include" }
      );

      if (!res.ok) {
        toast.error("Failed to load dashboard stats");
        return;
      }

      const data = await res.json();
      setStats(data.stats);
    } catch (err) {
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={loading ? "..." : stats.totalUsers}
        />
        <StatsCard
          title="Products"
          value={loading ? "..." : stats.totalProducts}
        />
        <StatsCard
          title="Managers"
          value={loading ? "..." : stats.totalManagers}
        />
        <StatsCard
          title="Employees"
          value={loading ? "..." : stats.totalEmployees}
        />
      </div>

      <QuickActions />

      {/* 🔥 USERS LIST INSIDE DASHBOARD */}
      <UsersPanel />

      <RecentActivity />
    </div>
  );
}
