import { useEffect, useState } from "react";
import { ShieldCheck, Users, UserCog } from "lucide-react";
import { FEATURE_LIST, FEATURE_PERMISSIONS } from "../../helper/permissions";
import { backendRoute, routes } from "../../backendUrl";
import { toast } from "react-toastify";
const PermissionPage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [featurePermissions, setFeaturePermissions] = useState({});
    const [selectedFeature, setSelectedFeature] = useState(null);
    useEffect(() => {
        const loadUsers = async () => {
            const res = await fetch(`${backendRoute}${routes.getAllUsers}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            setUsers(data.users || []);
        };
        loadUsers();
    }, []);

    const handleUserClick = async (user) => {
        setSelectedUser(user);
        setSelectedFeature(null);

        const res = await fetch(
            `${backendRoute}${routes.getUserPermissions}${user._id}`,
            {
                credentials: "include",
            }
        );
        const data = await res.json();

        const mapping = {};
        data?.permissions?.access?.forEach((a) => {
            mapping[a.feature] = a.permission;
        });

        setFeaturePermissions(mapping);
    };

    const handleFeatureClick = (feature) => {
        if (selectedFeature === feature) {
            setSelectedFeature(null);
            return;
        }

        setSelectedFeature(feature);

        if (!featurePermissions[feature]) {
            setFeaturePermissions((prev) => ({
                ...prev,
                [feature]: [],
            }));
        }
    };

    const togglePermission = (code) => {
        if (!selectedFeature) return;
        setFeaturePermissions((prev) => {
            const current = prev[selectedFeature] || [];

            return {
                ...prev,
                [selectedFeature]: current.includes(code)
                    ? current.filter((p) => p !== code)
                    : [...current, code],
            };
        });
    };

    const removeFeature = (feature) => {
        const updated = { ...featurePermissions };
        delete updated[feature];
        setFeaturePermissions(updated);
        if (selectedFeature === feature) setSelectedFeature(null);
    };

    const savePermissions = async () => {
        if (!selectedUser) return toast.error("Select a user first!");

        const formattedAccess = Object.keys(featurePermissions).map((f) => ({
            feature: f,
            permission: featurePermissions[f],
        }));

        const payload = {
            userId: selectedUser._id,
            access: formattedAccess,
        };

        const res = await fetch(`${backendRoute}${routes.updatePermissions}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            credentials: "include",
        });

        const data = await res.json();

        if (!data.success) return toast.error(data.message || "Failed to update");

        toast.success(data.message || "Permissions saved!");
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 h-full gap-6">
            {/* LEFT USER LIST */}
            <div className="bg-white shadow rounded-xl p-4 flex flex-col h-[95%]">
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
                    <Users size={20} /> All Users
                </h2>

                <div className="space-y-2 overflow-y-auto custom-scroll pr-2">
                    {users?.map((u) => (
                        <div
                            key={u._id}
                            onClick={() => handleUserClick(u)}
                            className={`cursor-pointer p-3 rounded-lg border transition
                ${selectedUser?._id === u._id
                                    ? "bg-gray-100 border-gray-600"
                                    : "border-gray-300"
                                }
              `}
                        >
                            <p className="font-medium">{u.name}</p>
                            {u.category!=="Manager"&&<p className="text-sm text-gray-500">{u.role==="Manager"?u.category+" "+u.role:u.role}</p>}
                            {u.category==="Manager"&&<p className="text-sm text-gray-500">{u.role}</p>}
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT PERMISSION EDITOR */}
            <div className="md:col-span-2 bg-white shadow rounded-xl p-6 h-[95%] overflow-hidden">
                {!selectedUser ? (
                    <div className="text-center text-gray-500 py-20">
                        <UserCog size={40} className="mx-auto mb-3" />
                        Select a user to manage permissions
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
                            <ShieldCheck size={22} /> Permissions for {selectedUser.name}
                        </h2>

                        <h3 className="text-lg font-semibold mb-2">Select Feature</h3>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                            {Object.keys(FEATURE_LIST).map((key) => {
                                const f = FEATURE_LIST[key];
                                return (
                                    <div
                                        key={key}
                                        onClick={() => handleFeatureClick(f)}
                                        className={`relative p-3 rounded-lg cursor-pointer border text-center capitalize
                      ${selectedFeature === f
                                                ? "bg-gray-900 text-white border-gray-900"
                                                : "bg-gray-100 border-gray-300"
                                            }
                    `}
                                    >
                                        {f}

                                        {featurePermissions[f]?.length > 0 && (
                                            <span className="absolute top-1 right-2 text-green-600 font-bold">
                                                ✓
                                            </span>
                                        )}

                                        {featurePermissions[f] && (
                                            <button
                                                className="absolute top-1 left-2 text-red-500 text-xs"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFeature(f);
                                                }}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* PERMISSION GRID */}
                        {selectedFeature && (
                            <>
                                <h3 className="text-lg font-semibold mb-2">
                                    Permissions for {selectedFeature}
                                </h3>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {FEATURE_PERMISSIONS[selectedFeature]?.map((perm) => (
                                        <div
                                            key={perm.code}
                                            onClick={() => togglePermission(perm.code)}
                                            className={`flex items-center justify-center gap-2 p-3 rounded-lg cursor-pointer capitalize border
                        ${featurePermissions[selectedFeature]?.includes(
                                                perm.code
                                            )
                                                    ? "bg-gray-800 text-white border-gray-800"
                                                    : "bg-gray-100 border-gray-300"
                                                }
                      `}
                                        >
                                            {perm.name}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        <button
                            onClick={savePermissions}
                            className=" cursor-pointer mt-8 bg-gray-800 hover:bg-black text-white px-6 py-2 rounded-lg shadow"
                        >
                            Save Permissions
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PermissionPage;
