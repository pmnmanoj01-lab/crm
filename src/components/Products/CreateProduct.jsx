import { useState, useMemo } from "react";
import Casting from "./Processes/Casting";
import { useAuth } from "../../context/store";
// ROLE → TABS Mapping
const ROLE_TABS = {
  Manager: ["Casting", "Filing", "Pre Polish", "Setting", "Polish", "Repair", "Rhodium"],
  admin: ["Casting", "Filing", "Pre Polish", "Setting", "Polish", "Repair", "Rhodium"],
  Casting: ["Casting"],
  Filing: ["Filing"],
  Prepolish: ["Pre Polish"],
  Setting: ["Setting"],
  Polish: ["Polish"],
  Repair: ["Repair"],
  Rhodium: ["Rhodium"]
};
const tabs = [
  { id: "Casting", label: "Casting", component: <Casting /> },
];

export default function ProcessTabs() {
  const { user } = useAuth();
  // Convert role → allowed tabs
  
  const allowedTabIds = ROLE_TABS[user?.role] || [];

  // Filter visible tabs
  const visibleTabs = useMemo(() => {
    // If manager → return all tabs
    if (user?.role === "Manager"||user?.role === "admin") return tabs;

    // Else filter only allowed ones
    return tabs.filter((t) => allowedTabIds.includes(t.label));
  }, [user, allowedTabIds]);

  // Set default active tab → first visible tab
  const [activeTab, setActiveTab] = useState(() =>
    visibleTabs.length ? visibleTabs[0].id : null
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Process Overview</h1>

      {/* Horizontal Tabs */}
      <div className="flex gap-3 border-b border-gray-300 pb-2 overflow-x-auto">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg font-medium cursor-pointer
              ${activeTab === tab.id
                  ? "bg-[#3c3d3d] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="bg-white p-4 mt-4 rounded shadow">
        {visibleTabs.find((t) => t.id === activeTab)?.component}
      </div>
    </div>
  );
}
