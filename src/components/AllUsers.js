// AllUsersDashboard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SkeletonBox = ({ width = "w-full", height = "h-4" }) => (
    <div className={`bg-gray-200 animate-pulse rounded ${width} ${height}`}></div>
);

const AllUsersDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    useEffect(() => {
        setTimeout(() => {
            setUsers([
                {
                    name: "Darrell Steward",
                    email: "darrellsteward@gmail.com",
                    dateJoined: "Dec 19 2023",
                    role: "User",
                    borrowed: 10,
                    idNo: "90324423789",
                    avatar: "https://i.imgur.com/B0yUQmE.png",
                },
                {
                    name: "Marc Atenson",
                    email: "marcinee@mial.com",
                    dateJoined: "Dec 19 2023",
                    role: "Admin",
                    borrowed: 32,
                    idNo: "90324423789",
                    avatar: "https://i.imgur.com/1nZb8FA.png",
                },
                {
                    name: "Susan Drake",
                    email: "contact@susandrak.io",
                    dateJoined: "Dec 19 2023",
                    role: "User",
                    borrowed: 13,
                    idNo: "90324423789",
                    initials: "SD",
                },
                // Add more dummy data for pagination demo
                {
                    name: "John Doe",
                    email: "john@example.com",
                    dateJoined: "Jan 01 2024",
                    role: "User",
                    borrowed: 5,
                    idNo: "90324423790",
                    initials: "JD",
                },
                {
                    name: "Jane Smith",
                    email: "jane@smith.io",
                    dateJoined: "Feb 02 2024",
                    role: "Admin",
                    borrowed: 17,
                    idNo: "90324423791",
                    initials: "JS",
                },
            ]);
            setLoading(false);
        }, 1500);
    }, []);

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const aVal = a[sortConfig.key]?.toString().toLowerCase();
        const bVal = b[sortConfig.key]?.toString().toLowerCase();
        if (!aVal || !bVal) return 0;
        return sortConfig.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
    const paginatedUsers = sortedUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="font-bold text-2xl">Welcome, Adrian</h1>
                <p className="text-sm text-gray-500">Monitor all of your projects and tasks here</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-lg">All Users</h2>
                    <input
                        type="text"
                        placeholder="Search users by name or email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="overflow-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8F8FF] text-sm text-[#64748B]">
                            <tr>
                                {[
                                    { key: "name", label: "Name" },
                                    { key: "dateJoined", label: "Date Joined" },
                                    { key: "role", label: "Role" },
                                    { key: "borrowed", label: "Books Borrowed" },
                                    { key: "idNo", label: "University ID No" },
                                ].map((col) => (
                                    <th
                                        key={col.key}
                                        onClick={() => handleSort(col.key)}
                                        className="px-4 py-2 cursor-pointer hover:text-blue-600 select-none"
                                    >
                                        {col.label} {sortConfig.key === col.key ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                                    </th>
                                ))}
                                <th className="px-4 py-2">University ID Card</th>
                                <th className="px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(6)].map((_, i) => (
                                    <tr key={i}>
                                        {[...Array(7)].map((__, j) => (
                                            <td key={j} className="px-4 py-4">
                                                <SkeletonBox width="w-24" height="h-4" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <AnimatePresence>
                                    {paginatedUsers.map((user, i) => (
                                        <motion.tr
                                            key={i}
                                            className="text-sm hover:bg-gray-50 transition-all"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <td className="px-4 py-4 flex items-center gap-3">
                                                {user.avatar ? (
                                                    <img src={user.avatar} className="w-8 h-8 rounded-full" alt="avatar" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                                                        {user.initials}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-[#1E293B]">{user.name}</p>
                                                    <p className="text-xs text-[#64748B]">{user.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">{user.dateJoined}</td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`text-xs font-medium px-2 py-1 rounded-full ${user.role === "Admin"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-pink-100 text-pink-700"
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">{user.borrowed}</td>
                                            <td className="px-4 py-4">{user.idNo}</td>
                                            <td className="px-4 py-4">
                                                <a href="#" className="text-sm text-[#25388C] underline">
                                                    View ID Card ↗
                                                </a>
                                            </td>
                                            <td className="px-4 py-4">
                                                <button>
                                                    <Trash size={16} className="text-red-500 hover:text-red-700" />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            )}
                        </tbody>
                    </table>
                    {!loading && sortedUsers.length === 0 && (
                        <div className="text-center py-6 text-gray-500">
                            <p className="text-lg font-medium">No users match your search 🔍</p>
                            <p className="text-sm">Try a different name or email address.</p>
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                <div className="mt-4 flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 rounded-md text-sm ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
                                } hover:bg-blue-400 hover:text-white transition-all`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllUsersDashboard;
