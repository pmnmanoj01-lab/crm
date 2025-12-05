import { useState } from "react";
import { useAuth } from "../../context/store";
import AboutSection from "./Profile/AboutSection";
import WorkedOnSection from "./Profile/WorkedOnSection";
import PermissionsSections from "./Profile/PermissionsSections";

export default function ProfilePage() {
    const { user } = useAuth();
    const avatar =
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=500&q=80";
    const cover =
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80";

    const [activeTab, setActiveTab] = useState("about");

    const renderContent = () => {
        switch (activeTab) {
            case "about":
                return <AboutSection />;

            case "worked":
                return <WorkedOnSection />;

            case "permissions":
                // ❌ Admin should not see permissions
                if (user?.role === "admin") {
                    return <AboutSection />;
                }
                return <PermissionsSections />;

            default:
                return <AboutSection />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* COVER IMAGE */}
            <div
                className="h-56 bg-center bg-cover"
                style={{ backgroundImage: `url(${cover})` }}
            />

            <div className="max-w-7xl mx-auto -mt-16 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* LEFT CARD + SIDEBAR */}
                    <div>
                        {/* PROFILE CARD */}
                        <div className="bg-white rounded-xl shadow p-6 relative">
                            <div className="-mt-20 flex justify-center">
                                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
                                    <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                                </div>
                            </div>

                            <div className="text-center mt-4">
                                <h2 className="text-xl font-semibold">{user?.name || "User"}</h2>
                                <p className="text-sm text-gray-500">
                                    {user?.role ? user.role.toUpperCase() : "-"}
                                </p>
                            </div>
                        </div>

                        {/* SIDEBAR NAVIGATION */}
                        <div className="mt-6 bg-white shadow rounded-xl p-4">
                            <ul className="space-y-2 text-sm">
                                <li
                                    onClick={() => setActiveTab("about")}
                                    className={`p-2 rounded cursor-pointer ${
                                        activeTab === "about"
                                            ? "bg-gray-900 text-white"
                                            : "hover:bg-gray-100"
                                    }`}
                                >
                                    About
                                </li>

                                <li
                                    onClick={() => setActiveTab("worked")}
                                    className={`p-2 rounded cursor-pointer ${
                                        activeTab === "worked"
                                            ? "bg-gray-900 text-white"
                                            : "hover:bg-gray-100"
                                    }`}
                                >
                                    Worked On
                                </li>

                                {/* ❌ Admin should not see Permissions tab */}
                                {user?.role !== "admin" && (
                                    <li
                                        onClick={() => setActiveTab("permissions")}
                                        className={`p-2 rounded cursor-pointer ${
                                            activeTab === "permissions"
                                                ? "bg-gray-900 text-white"
                                                : "hover:bg-gray-100"
                                        }`}
                                    >
                                        Permissions
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* RIGHT CONTENT AREA */}
                    <div className="md:col-span-2 space-y-6">
                        {renderContent()}
                    </div>
                </div>
            </div>

            <div className="h-10" />
        </div>
    );
}
