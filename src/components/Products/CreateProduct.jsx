import { useState } from "react";
import Casting from "./Processes/Casting";
import Filing from "./Processes/Filing";
import PrePolish from "./Processes/PrePolish";
import Setting from "./Processes/Setting";
import Polish from "./Processes/Polish";
import Repair from "./Processes/Repair";
import RhodiumB from "./Processes/RhodiumB";

const tabs = [
  { id: "casting", label: "Casting", component: <Casting /> },
  { id: "filing", label: "Filing", component: <Filing /> },
  { id: "prepolish", label: "Prepolish", component: <PrePolish /> },
  { id: "setting", label: "Setting", component: <Setting /> },
  { id: "finalpolish", label: "Final Polish", component: <Polish /> },
  { id: "repair", label: "Repair", component: <Repair /> },
  { id: "rhodium", label: "Rhodium", component: <RhodiumB /> },
];

export default function ProcessTabs() {
  const [activeTab, setActiveTab] = useState("casting");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Process Overview</h1>

      {/* Horizontal Tabs */}
      <div className="flex gap-3 border-b border-gray-300 pb-2 overflow-x-auto">

        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-2 rounded-t-lg font-medium
              ${
                activeTab === tab.id
                  ? "bg-[#3c3d3d] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }
            `}
          >
            {tab.label}
          </button>
        ))}

      </div>

      {/* TAB CONTENT */}
      <div className="bg-white p-4 mt-4 rounded shadow">
        {tabs.find((t) => t.id === activeTab)?.component}
      </div>
    </div>
  );
}
