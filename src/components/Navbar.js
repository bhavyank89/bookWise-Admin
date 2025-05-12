"use client";

import React from "react";
import {
    BookOpen,
    House,
    Users,
    BookMarked,
    UserRound,
    LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar({ setIsLogin, setActiveUser, activeUser, closeSidebar }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (path) => {
        navigate(path);
        if (closeSidebar) closeSidebar();
    };

    const isActive = (path) => location.pathname.startsWith(path);

    const handleLogout = () => {
        setIsLogin(false);
        setActiveUser(null);
        navigate("/login");
    };

    return (
        <section className="bg-gray-50 p-4 w-full flex flex-col gap-6 h-full shadow-lg">
            {/* Header */}
            <div
                onClick={() => handleNavigation("/dashboard")}
                className="cursor-pointer pt-2"
            >
                <h1 className="text-3xl text-[#25388C] font-bold flex items-center gap-2">
                    <BookOpen size={28} /> BookWise
                </h1>
                <hr className="border-t-2 border-gray-300 my-2" />
            </div>

            {/* Navigation Menu */}
            <nav>
                <ul className="flex flex-col gap-2 text-gray-700">
                    <li
                        className={`cursor-pointer p-2 rounded-xl flex items-center gap-2 transition-all duration-200 ease-in-out ${isActive("/") &&
                                !isActive("/all-users") &&
                                !isActive("/borrow-requests") &&
                                !isActive("/account-requests")
                                ? "bg-[#25388C] text-white shadow-md"
                                : "hover:bg-[#25388C] hover:text-white"
                            }`}
                        onClick={() => handleNavigation("/")}
                    >
                        <House size={18} /> Home
                    </li>
                    <li
                        className={`cursor-pointer p-2 rounded-xl flex items-center gap-2 transition-all duration-200 ease-in-out ${isActive("/all-users")
                                ? "bg-[#25388C] text-white shadow-md"
                                : "hover:bg-[#25388C] hover:text-white"
                            }`}
                        onClick={() => handleNavigation("/all-users")}
                    >
                        <Users size={18} /> All Users
                    </li>
                    <li
                        className={`cursor-pointer p-2 rounded-xl flex items-center gap-2 transition-all duration-200 ease-in-out ${isActive("/borrow-requests")
                                ? "bg-[#25388C] text-white shadow-md"
                                : "hover:bg-[#25388C] hover:text-white"
                            }`}
                        onClick={() => handleNavigation("/borrow-requests")}
                    >
                        <BookMarked size={18} /> Borrow Requests
                    </li>
                    <li
                        className={`cursor-pointer p-2 rounded-xl flex items-center gap-2 transition-all duration-200 ease-in-out ${isActive("/account-requests")
                                ? "bg-[#25388C] text-white shadow-md"
                                : "hover:bg-[#25388C] hover:text-white"
                            }`}
                        onClick={() => handleNavigation("/account-requests")}
                    >
                        <UserRound size={18} /> Account Requests
                    </li>
                </ul>
            </nav>

            {/* Profile Footer */}
            <div className="mt-auto mb-14 p-2 border border-gray-500 rounded-full">
                <div className="flex items-center gap-2">
                    {/* Profile Picture */}
                    <div className="relative w-8 h-8">
                        <img
                            src={
                                activeUser?.avatar ||
                                "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1974&auto=format&fit=crop"
                            }
                            alt="Profile"
                            className="rounded-full w-8 h-8"
                        />
                        <div className="absolute bottom-0 right-0 bg-green-500 w-2 h-2 border-2 border-white rounded-full" />
                    </div>

                    {/* User Info */}
                    <div>
                        <h1 className="text-gray-900 font-bold text-[12px]">
                            {activeUser?.name || "John Jacob"}
                        </h1>
                        <p className="text-xs text-gray-600">
                            {activeUser?.email || "johnjacob@hotmail.com"}
                        </p>
                    </div>

                    {/* Logout Button */}
                    <button
                        className="ml-auto p-2 rounded-full hover:bg-gray-100 transition-all"
                        onClick={handleLogout}
                    >
                        <LogOut size={20} color="#F44336" />
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Navbar;
