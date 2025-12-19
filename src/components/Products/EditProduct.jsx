import { useState, useEffect, useMemo } from "react";
import Casting from "./Processes/Casting";
import Filing from "./Processes/Filing";
import PrePolish from "./Processes/PrePolish";
import Setting from "./Processes/Setting";
import Polish from "./Processes/Polish";
import Repair from "./Processes/Repair";
import { useAuth } from "../../context/store";
import { backendRoute, routes } from "../../backendUrl";
import { useParams } from "react-router-dom";

const PROCESS_FLOW = [
  "Casting",
  "Filing",
  "Pre Polish",
  "Setting",
  "Polish",
  "Repair"
];

const TABS = [
  { id: "Casting", label: "Casting", processId: 1, component: Casting },
  { id: "Filing", label: "Filing", processId: 2, component: Filing },
  { id: "Pre Polish", label: "Pre Polish", processId: 3, component: PrePolish },
  { id: "Setting", label: "Setting", processId: 4, component: Setting },
  { id: "Polish", label: "Polish", processId: 5, component: Polish },
  { id: "Repair", label: "Repair", processId: 6, component: Repair }
];

export default function EditProduct() {
    const { productId } = useParams(); // 👈 get id from URL
const [material,setMaterial]=useState("")
  const { user } = useAuth();
  const [completedProcesses, setCompletedProcesses] = useState([]);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${backendRoute}${routes.getProductById}${productId}`,{
        method:"GET",
        credentials:"include"
      });
      const data = await res.json();
      setMaterial(data?.data?.material||"")
      setCompletedProcesses(data?.data?.completedProcesses || []);
    } catch (err) {
      console.error("Fetch product error", err);
    }
  };

  const allowedTabs = useMemo(() => {
    const role = user?.role;
// console.log("user role is as--------> ",completedProcesses,PROCESS_FLOW.length)
    // ADMIN / MANAGER
    if (role === "Manager" || role === "admin") {

      // All completed => full access
      if (completedProcesses.length === PROCESS_FLOW.length) {
        return TABS;
      }

      // Find first process NOT completed
      const nextPending = PROCESS_FLOW.find(
        (p) => !completedProcesses.includes(p)
      );

      return TABS.filter((tab) => {
        return (
          completedProcesses.includes(tab.id) ||
          tab.id === nextPending
        );
      });
    }

    // WORKER
    const workerProcess = role;
    const index = PROCESS_FLOW.indexOf(workerProcess);

    if (workerProcess === "Casting") {
      return TABS.filter((t) => t.id === "Casting");
    }

    const previous = PROCESS_FLOW[index - 1];

    if (completedProcesses.includes(previous)) {
      return TABS.filter((t) => t.id === workerProcess);
    }

    return [];
  }, [user, completedProcesses]);

  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (allowedTabs.length) {
      setActiveTab(allowedTabs[0].id);
    }
  }, [allowedTabs]);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Process Overview</h1>

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

      <div className="bg-white p-4 mt-4 rounded shadow">
        {allowedTabs
          .filter((t) => t.id === activeTab)
          .map((tab) => {
            const Component = tab.component;
            return (
              <Component
                key={tab.id}
                productId={productId}
                processId={tab.id}
                material={material}
                onProcessUpdated={fetchProduct}
              />
            );
          })}
      </div>
    </div>
  );
}
