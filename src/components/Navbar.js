"use client";

import React from "react";
import { BookOpen, House, Users, BookMarked, UserRound, LogOut, Book, Pen, ChevronLeft, ChevronRight, X, } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import * as Tooltip from "@radix-ui/react-tooltip";

function Navbar({ setIsLogin, setActiveUser, activeUser, closeSidebar, setCollapse, collapse }) {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const handleNavigation = (path) => {
        navigate(path);
        if (closeSidebar) closeSidebar();
    };

    const handleLogout = () => {
        setIsLogin(false);
        setActiveUser(null);
        localStorage.removeItem("adminToken");
        navigate("/login");
    };

    const toggleCollapse = () => {
        setCollapse(!collapse);
    };

    return (
        <section className="bg-gray-50 p-4 w-full flex flex-col gap-6 h-full shadow-lg relative">
            {/* Mobile Close Button */}
            <button className="md:hidden absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-all z-10" onClick={closeSidebar}>
                <X size={20} className="text-gray-600" />
            </button>

            {/* Desktop Collapse Button */}
            <button className="hidden md:block bg-gray-300 absolute top-4 right-5 p-2 rounded-full hover:bg-gray-200 transition-all z-40" onClick={toggleCollapse}>
                {collapse ? <ChevronRight size={20} className="text-black" /> : <ChevronLeft size={20} className="text-black" />}
            </button>

            {/* Header */}
            <div onClick={() => handleNavigation("/")} className="mt-10 pt-2 cursor-pointer transition-all duration-300">
                <div className={`flex items-center ${collapse ? "justify-center" : "gap-2"} transition-all duration-300`}>
                    <BookOpen size={28} className="text-[#25388C] flex-shrink-0 transition-all duration-300" />
                    {!collapse && (
                        <h1 className="text-3xl text-[#25388C] font-bold transition-all duration-300">
                            BookWise
                        </h1>
                    )}
                </div>
                <hr className="border-t-2 border-gray-300 my-2" />
            </div>


            {/* Navigation Menu */}
            <nav className="overflow-y-auto flex-1">
                <ul className="flex flex-col gap-2 text-gray-700">
                    <li
                        className={`cursor-pointer p-3 rounded-xl flex items-center gap-3 transition-all duration-200 ease-in-out ${isActive("/")
                            ? "bg-[#25388C] text-white shadow-md"
                            : "hover:bg-[#25388C] hover:text-white"
                            }`}
                        onClick={() => handleNavigation("/")}
                    >
                        <House size={18} className="flex-shrink-0" />
                        {!collapse && <span className="transition-all duration-300">Home</span>}
                    </li>
                    <li
                        className={`cursor-pointer p-3 rounded-xl flex items-center gap-3 transition-all duration-200 ease-in-out ${isActive("/all-users")
                            ? "bg-[#25388C] text-white shadow-md"
                            : "hover:bg-[#25388C] hover:text-white"
                            }`}
                        onClick={() => handleNavigation("/all-users")}
                    >
                        <Users size={18} className="flex-shrink-0" />
                        {!collapse && <span className="transition-all duration-300">All Users</span>}
                    </li>
                    <li
                        className={`cursor-pointer p-3 rounded-xl flex items-center gap-3 transition-all duration-200 ease-in-out ${isActive("/all-books")
                            ? "bg-[#25388C] text-white shadow-md"
                            : "hover:bg-[#25388C] hover:text-white"
                            }`}
                        onClick={() => handleNavigation("/all-books")}
                    >
                        <Book size={18} className="flex-shrink-0" />
                        {!collapse && <span className="transition-all duration-300">All Books</span>}
                    </li>
                    <li
                        className={`cursor-pointer p-3 rounded-xl flex items-center gap-3 transition-all duration-200 ease-in-out ${isActive("/borrow-requests")
                            ? "bg-[#25388C] text-white shadow-md"
                            : "hover:bg-[#25388C] hover:text-white"
                            }`}
                        onClick={() => handleNavigation("/borrow-requests")}
                    >
                        <BookMarked size={18} className="flex-shrink-0" />
                        {!collapse && <span className="transition-all duration-300">Borrow Requests</span>}
                    </li>
                    <li
                        className={`cursor-pointer p-3 rounded-xl flex items-center gap-3 transition-all duration-200 ease-in-out ${isActive("/account-requests")
                            ? "bg-[#25388C] text-white shadow-md"
                            : "hover:bg-[#25388C] hover:text-white"
                            }`}
                        onClick={() => handleNavigation("/account-requests")}
                    >
                        <UserRound size={18} className="flex-shrink-0" />
                        {!collapse && <span className="transition-all duration-300">Account Requests</span>}
                    </li>
                    <li
                        className={`cursor-pointer p-3 rounded-xl flex items-center gap-3 transition-all duration-200 ease-in-out ${isActive("/createBook")
                            ? "bg-[#25388C] text-white shadow-md"
                            : "hover:bg-[#25388C] hover:text-white"
                            }`}
                        onClick={() => handleNavigation("/createBook")}
                    >
                        <Pen size={18} className="flex-shrink-0" />
                        {!collapse && <span className="transition-all duration-300">Create Book</span>}
                    </li>
                </ul>
            </nav>

            {/* Profile Footer */}
            <div className="mt-auto p-3 border border-gray-300 rounded-xl bg-white">
                {!collapse ? (
                    // Expanded view
                    <div className="flex items-center gap-3">
                        {/* Profile Picture */}
                        <div className="relative w-10 h-10 flex-shrink-0">
                            <img
                                src={
                                    activeUser?.avatar?.[0]?.path ||
                                    "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1974&auto=format&fit=crop"
                                }
                                alt="Profile"
                                className="rounded-full w-10 h-10 object-cover"
                            />
                            <div className="absolute bottom-0 right-0 bg-green-500 w-3 h-3 border-2 border-white rounded-full" />
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0 transition-all duration-300">
                            <h1 className="text-gray-900 font-semibold text-sm truncate">
                                {activeUser?.name || "John Jacob"}
                            </h1>
                            <p className="text-xs text-gray-600 truncate">
                                {activeUser?.email || "johnjacob@hotmail.com"}
                            </p>
                        </div>

                        {/* Logout */}
                        <button
                            className="p-2 rounded-full hover:bg-gray-100 transition-all flex-shrink-0"
                            onClick={handleLogout}
                            title="Logout"
                        >
                            <LogOut size={18} color="#F44336" />
                        </button>
                    </div>
                ) : (
                    // Collapsed view
                    <div className="flex flex-col items-center justify-center gap-2">
                        {/* Tooltip wrapper */}
                        <Tooltip.Provider delayDuration={200}>
                            <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                    <div className="relative w-7 h-7 cursor-pointer">
                                        <img
                                            src={
                                                activeUser?.avatar?.[0]?.path ||
                                                "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1974&auto=format&fit=crop"
                                            }
                                            alt="Profile"
                                            className="rounded-full w-7 h-7 object-cover"
                                        />
                                        <div className="absolute bottom-0 right-0 bg-green-500 w-2 h-2 border-2 border-white rounded-full" />
                                    </div>
                                </Tooltip.Trigger>

                                <Tooltip.Portal>
                                    <Tooltip.Content
                                        className="px-4 py-2 rounded-md text-sm bg-gray-900 text-white shadow-md max-w-[200px]"
                                        side="right"
                                        sideOffset={6}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium truncate">
                                                {activeUser?.name || "John Jacob"}
                                            </span>
                                            <span className="text-xs text-gray-300 truncate">
                                                {activeUser?.email || "johnjacob@hotmail.com"}
                                            </span>
                                        </div>
                                        <Tooltip.Arrow className="fill-gray-900" />
                                    </Tooltip.Content>
                                </Tooltip.Portal>
                            </Tooltip.Root>
                        </Tooltip.Provider>

                        {/* Logout below avatar */}
                        <button
                            className="p-2 rounded-full hover:bg-gray-100 transition-all"
                            onClick={handleLogout}
                            title="Logout"
                        >
                            <LogOut size={18} color="#F44336" />
                        </button>
                    </div>

                )}
            </div>

        </section>
    );
}

export default Navbar;