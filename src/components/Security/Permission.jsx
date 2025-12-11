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
            { credentials: "include" }
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
        if (!data.success) return toast.error(data.message);

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
                                ${
                                    selectedUser?._id === u._id
                                        ? "bg-gray-100 border-gray-600"
                                        : "border-gray-300"
                                }`}
                        >
                            <p className="font-medium">{u.name}</p>
                            <p className="text-sm text-gray-500">
                                {u.category === "Manager"
                                    ? u.role
                                    : u.role === "Manager"
                                    ? u.category + " " + u.role
                                    : u.role}
                            </p>
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

                        {/* --- LEFT FEATURE HEADER --- */}
                        <div className="grid grid-cols-4 gap-2 mt-6">
                            {Object.keys(FEATURE_LIST).map((key) => {
                                const f = FEATURE_LIST[key];
                                return (
                                    <div
                                        key={key}
                                        onClick={() => handleFeatureClick(f)}
                                        className={`p-2 rounded-md text-center border cursor-pointer border-gray-300 text-sm 
                                            ${
                                                selectedFeature === f
                                                    ? "bg-black text-white border-black"
                                                    : "bg-gray-100"
                                            }`}
                                    >
                                        {f}

                                        {featurePermissions[f]?.length > 0 && (
                                            <span className="ml-1 text-green-600 font-bold">✓</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* --- RIGHT CHECKBOX PERMISSION UI --- */}
                        {selectedFeature && (
                            <div className="mt-8 bg-gray-50 p-5 border rounded-xl border-gray-300">
                                <h3 className="text-lg font-semibold mb-4">
                                    Permissions for {selectedFeature}
                                </h3>

                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                    {FEATURE_PERMISSIONS[selectedFeature]?.map((perm) => (
                                        <label
                                            key={perm.code}
                                            className="flex items-center justify-between bg-white p-3 border border-gray-300 rounded-md shadow-sm cursor-pointer"
                                        >
                                            <span className="font-medium capitalize">{perm.name}</span>

                                            <input
                                                type="checkbox"
                                                checked={featurePermissions[selectedFeature]?.includes(
                                                    perm.code
                                                )}
                                                onChange={() => togglePermission(perm.code)}
                                                className="w-5 h-5 cursor-pointer accent-black"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={savePermissions}
                            className="mt-8 bg-gray-800 text-white hover:bg-black px-6 py-2 cursor-pointer rounded-lg shadow"
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
