import React from "react";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";



export default function DashboardLayout({ children }) {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="p-4 bg-gray-50 h-full overflow-auto custom-scroll">{children}</main>
            </div>
        </div>
    );
}