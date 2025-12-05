import { Link } from "react-router-dom";
import { Home,  Shield, Users, User2, LogOut } from "lucide-react";
import { useAuth } from "../../context/store";
import { useAccess } from "../hooks/canAccess";
import { FEATURE_LIST } from "../../helper/permissions";
export default function Sidebar() {
    const { logout,user } = useAuth()
    const {can} =useAccess()
    return (
        <aside className="h-screen w-44 bg-[#3c3d3d] text-white p-4 space-y-6">
            <h2 className="text-2xl font-bold mb-6"><img src="/bhunte_logo1.png" className="text-white" alt="bhunte jewellers logo" /></h2>
            <div className="w-full h-px bg-white mb-6"></div>
            <nav className="space-y-4">
                {can(FEATURE_LIST.dashboard) &&<Link to="/" className="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded cursor-pointer">
                    <Home size={20} /> <span>Home</span>
                </Link>}
                 {can(FEATURE_LIST.team) &&<Link to="/dashboard/team" className="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded cursor-pointer">
                    <Users size={20} /> <span>Team</span>
                </Link>}
                 {can(FEATURE_LIST.permissions)&&(user.role==="admin"||user.category==="Manager") &&<Link to="/dashboard/permissions" className="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded cursor-pointer">
                    <Shield size={20} /> <span>Permissions</span>
                </Link>}
                {can(FEATURE_LIST.profile) &&<Link to="/dashboard/profile" className="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded cursor-pointer">
                    < User2 size={20} /> <span>Profile</span>
                </Link>}
                <button onClick={logout} className="flex items-center space-x-3 hover:w-full hover:bg-gray-800 p-2 rounded cursor-pointer">
                    <LogOut size={20} /> <span>Logout</span>
                </button>
            </nav>
        </aside>
    );
}