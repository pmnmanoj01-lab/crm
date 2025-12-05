import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/store';
import { Users, Mail, MapPin, Building, Briefcase, Edit,PhoneCall } from "lucide-react";
import { useAccess } from '../../hooks/canAccess';
import { FEATURE_LIST, PERMISSION_TYPES } from '../../../helper/permissions';
const AboutSection = () => {
    const { user } = useAuth();
    const { can } = useAccess();
    const navigate = useNavigate();
    // 🔥 Check permission for editing profile
    const canEditProfile = can(FEATURE_LIST.profile, PERMISSION_TYPES.patch);
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <div className='flex justify-between'>
                <h3 className="text-lg font-semibold mb-4">About</h3>

                {/* ✔ Edit icon only visible if user has PATCH permission */}
                {canEditProfile && (
                    <button
                        onClick={() => navigate(`/dashboard/edit-profile/${user?._id}`)}
                        className="text-[#3c3d3d] mb-8 hover:text-black cursor-pointer"
                    >
                        <Edit size={18} />
                    </button>
                )}
            </div>

            <ul className="space-y-4 text-sm text-gray-700">

                <li className="flex items-start gap-3">
                    <Briefcase size={18} className="text-gray-400 mt-1" />
                    <div>
                        <div className="text-xs text-gray-400">Job Title</div>
                        <div className="font-medium">{user?.role?.toUpperCase() || "N/A"}</div>
                    </div>
                </li>

                <li className="flex items-start gap-3">
                    <Building size={18} className="text-gray-400 mt-1" />
                    <div>
                        <div className="text-xs text-gray-400">Department</div>
                        <div className="font-medium">{user?.category?.toUpperCase() || "N/A"}</div>
                    </div>
                </li>

                <li className="flex items-start gap-3">
                    <Users size={18} className="text-gray-400 mt-1" />
                    <div>
                        <div className="text-xs text-gray-400">Organization</div>
                        <div className="font-medium">
                            {user?.company?.toUpperCase() || "BHUNTE JEWELERS PVT LTD"}
                        </div>
                    </div>
                </li>

                <li className="flex items-start gap-3">
                    <MapPin size={18} className="text-gray-400 mt-1" />
                    <div>
                        <div className="text-xs text-gray-400">Location</div>
                        <div className="font-medium">
                            House No. B-43, 3rd Floor, Lawrance Road Industrial, Delhi, 110035
                        </div>
                    </div>
                </li>

                <li className="flex items-start gap-3">
                    <Mail size={18} className="text-gray-400 mt-1" />
                    <div>
                        <div className="text-xs text-gray-400">Email</div>
                        <div className="font-medium">{user?.email}</div>
                    </div>
                </li>
                <li className="flex items-start gap-3">
                    <PhoneCall size={18} className="text-gray-400 mt-1" />
                    <div>
                        <div className="text-xs text-gray-400">Mobile No.</div>
                        <div className="font-medium">{user?.phone}</div>
                    </div>
                </li>

            </ul>
        </div>
    );
};

export default AboutSection;
