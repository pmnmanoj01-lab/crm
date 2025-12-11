import { useState, useEffect, useMemo } from "react";
import Casting from "./Processes/Casting";
import Filing from "./Processes/Filing";
import PrePolish from "./Processes/PrePolish";
import Setting from "./Processes/Setting";
import Polish from "./Processes/Polish";
import Repair from "./Processes/Repair";
import { useAuth } from "../../context/store";
// -----------------------------------------------------
// FIXED PROCESS FLOW ORDER
// -----------------------------------------------------
const PROCESS_FLOW = [
  "Casting",
  "Filing",
  "Pre Polish",
  "Setting",
  "Polish",
  "Repair",
];

// -----------------------------------------------------
// ALL TABS + PROCESS ID
// -----------------------------------------------------
const TABS = [
  { id: "Casting", label: "Casting", processId: 1, component: Casting },
  { id: "Filing", label: "Filing", processId: 2, component: Filing },
  { id: "Pre Polish", label: "Pre Polish", processId: 3, component: PrePolish },
  { id: "Setting", label: "Setting", processId: 4, component: Setting },
  { id: "Polish", label: "Polish", processId: 5, component: Polish },
  { id: "Repair", label: "Repair", processId: 6, component: Repair },
];

export default function EditProduct({ productId }) {
  const { user } = useAuth();

  // COMPLETED PROCESS FROM BACKEND
  const [completedProcesses, setCompletedProcesses] = useState([]);

  // -----------------------------------------------------
  // FETCH PRODUCT DETAILS USING fetch()
  // -----------------------------------------------------
  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/product/${productId}`);
      const data = await res.json();

      setCompletedProcesses(data.product?.completedProcesses || []);
    } catch (err) {
      console.error("Fetch product error", err);
    }
  };

  // -----------------------------------------------------
  // ROLE + PROCESS PROGRESSION LOGIC
  // -----------------------------------------------------
  const allowedTabs = useMemo(() => {
    const role = user?.role;

    // ADMIN / MANAGER = FULL ACCESS
    if (role === "Manager" || role === "admin") {
      return TABS;
    }

    // WORKER (ROLE NAME = PROCESS NAME)
    const workerProcess = role;
    const index = PROCESS_FLOW.indexOf(workerProcess);

    // FIRST PROCESS ALWAYS ALLOWED
    if (workerProcess === "Casting") {
      return TABS.filter((t) => t.id === "Casting");
    }

    // CHECK IF PREVIOUS PROCESS IS COMPLETED
    const previous = PROCESS_FLOW[index - 1];

    if (completedProcesses.includes(previous)) {
      return TABS.filter((t) => t.id === workerProcess);
    }

    // PROCESS LOCKED
    return [];
  }, [user, completedProcesses]);

  // -----------------------------------------------------
  // DEFAULT TAB
  // -----------------------------------------------------
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (allowedTabs.length) {
      setActiveTab(allowedTabs[0].id);
    }
  }, [allowedTabs]);


  // -----------------------------------------------------
  // RENDER
  // -----------------------------------------------------
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Process Overview</h1>

      {/* TABS */}
      <div className="flex gap-3 border-b border-gray-300 pb-2 overflow-x-auto">
        {allowedTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg font-medium cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#3c3d3d] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="bg-white p-4 mt-4 rounded shadow">
        {allowedTabs
          .filter((t) => t.id === activeTab)
          .map((tab) => {
            const Component = tab.component;
            return (
              <Component
                key={tab.id}
                productId={productId}
                processId={PROCESS_FLOW[tab.processId-1]}   // <-- SEND PROCESS ID HERE
              />
            );
          })}
      </div>
    </div>
  );
}
