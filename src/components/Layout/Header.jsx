import React from "react";
import { User, BellIcon, LogOut, UserCog } from "lucide-react";
import { useAuth } from "../../context/store";


export default function Header() {
  const { user, exitImpersonation } = useAuth();


  return (
    <>

      {user?.isImpersonating && (
        <div className="w-full bg-gradient-to-r from-slate-50 to-slate-100 
                  border-b border-slate-200
                  text-slate-800 text-sm px-4 py-2.5
                  flex justify-between items-center">

          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 
                       rounded-full bg-blue-100 text-blue-700">
              <UserCog size={16} />
            </span>

            <span>
              You are impersonating{" "}
              <b className="font-semibold text-slate-900">{user?.name}</b>{" "}
              <span className="text-slate-500">({user?.role})</span>
            </span>
          </div>

          <button
            onClick={exitImpersonation}
            className="flex items-center gap-2 px-3 py-1.5 
                 rounded-md text-blue-700 bg-blue-50
                 hover:bg-blue-100 hover:text-blue-900
                 transition font-medium cursor-pointer"
          >
            <LogOut size={16} />
            Exit
          </button>
        </div>
      )}



      {/* 🔵 MAIN HEADER (UNCHANGED UI) */}
      <header className="w-full h-16 bg-white shadow flex items-center px-4 justify-between">
        <input
          type="text"
          placeholder="Search Here..."
          className="w-64 px-3 py-2 rounded-lg focus:outline-none border border-gray-300"
        />

        <div className="flex items-center space-x-4">
          <h2 className="font-medium">
            Hello, {user?.name || "User"}
          </h2>

          <button className="p-2 rounded-full hover:bg-gray-100">
            <BellIcon />
          </button>

          <button className="p-2 rounded-full hover:bg-gray-100">
            <User />
          </button>
        </div>
      </header>
    </>
  );
}
