import React from "react";
import {User,BellIcon} from "lucide-react";
import { useAuth } from "../../context/store";

export default function Header() {
    const {user} =useAuth()
    return (
        <header className="w-full h-16 bg-white shadow flex items-center px-4 justify-between">
                        <input type="text" placeholder="Search Here..." className="w-64 px-3 py-2  rounded-lg focus:outline-none border border-gray-300" />
            <div className="flex items-center space-x-4">
                <h2>Hello,{user?.name||"User"}</h2>
                <button className="p-2 rounded-full hover:bg-gray-100"><BellIcon/></button>
                <button className="p-2 rounded-full hover:bg-gray-100"><User/></button>
            </div>
        </header>
    );
}