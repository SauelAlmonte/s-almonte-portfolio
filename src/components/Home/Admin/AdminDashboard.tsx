"use client";
import { signOut } from "next-auth/react"


const AdminDashboard = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#181c29]">
        <h1 className="text-3xl font-bold text-cyan-100 mb-8">Admin Dashboard</h1>
        <button
            onClick={() => signOut({ redirectTo: "/", redirect: true })}
            className="px-6 py-3 bg-cyan-700 hover:bg-cyan-600 rounded-lg text-white font-semibold shadow transition cursor-pointer"
        >
            Log Out
        </button>
    </div>
);

export default AdminDashboard;
