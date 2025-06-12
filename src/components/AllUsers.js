import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/Skeleton";
import { Trash2, ChevronDown } from "lucide-react";

export default function MyComponent() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortAsc, setSortAsc] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [inputEmail, setInputEmail] = useState("");

    useEffect(() => {
        async function fetchUsers() {
            try {
                setLoading(true);
                const res = await fetch("http://localhost:4000/fetchall");
                const json = await res.json();
                if (!res.ok) throw new Error(json.message || "Failed to fetch users");
                setUsers(json.users || []);
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        }
        setTimeout(fetchUsers, 1000);
    }, []);

    useEffect(() => {
        let filtered = users.filter(
            (user) =>
                user.name?.toLowerCase().includes(search.toLowerCase()) ||
                user.email?.toLowerCase().includes(search.toLowerCase())
        );

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const valA = (a[sortConfig.key] || "").toString().toLowerCase();
                const valB = (b[sortConfig.key] || "").toString().toLowerCase();
                if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
                if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }

        setFilteredUsers(filtered);
    }, [users, search, sortConfig]);

    const paginatedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const toggleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    const handleDelete = async () => {
        if (!selectedUser || inputEmail !== selectedUser.email) {
            toast.error("Email does not match!");
            return;
        }

        try {
            const res = await fetch(`/api/user/${selectedUser._id}`, {
                method: "DELETE",
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Deletion failed");

            toast.success("User deleted!");
            setUsers((prev) => prev.filter((u) => u._id !== selectedUser._id));
            setShowDeleteModal(false);
            setInputEmail("");
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Toaster position="top-right" />
            <h1 className="text-2xl font-semibold mb-1">Welcome, Adrian</h1>
            <p className="text-sm text-gray-500 mb-6">Monitor all of your projects and tasks here</p>

            <div className="mb-4 bg-white rounded shadow p-4">
                <h2 className="text-lg font-bold mb-4">All Users</h2>
                <div className="flex items-center justify-between mb-4">
                    <input
                        type="text"
                        placeholder="Search users by name, email, or university ID."
                        className="w-1/2 px-4 py-2 border rounded shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        onClick={() => {
                            setSortAsc(!sortAsc);
                            setSortConfig({
                                key: "createdAt",
                                direction: sortAsc ? "asc" : "desc",
                            });
                        }}
                        className="flex items-center gap-1 border px-4 py-2 rounded shadow-sm"
                    >
                        {sortAsc ? "Oldest to Recent" : "Recent to Oldest"}
                        <ChevronDown size={16} className={`${sortAsc ? "rotate-180" : ""} transition-transform`} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="text-gray-600 bg-[#F8F8FF]">
                                <th className="py-2 pl-2 w-1/4" onClick={() => toggleSort("name")}>Name</th>
                                <th className="p-3">University ID</th>
                                <th className="p-3">Created</th>
                                <th className="p-3">Borrowed Books</th>
                                <th className="py-2 w-1/5">University ID Card</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(usersPerPage)].map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={8}><Skeleton className="h-10 w-full my-2" /></td>
                                    </tr>
                                ))
                            ) : paginatedUsers.length > 0 ? (
                                <AnimatePresence>
                                    {paginatedUsers.map((user) => (
                                        <motion.tr
                                            key={user._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="py-2 pl-2 flex items-center gap-3">
                                                {user.avatar?.[0]?.path ? (
                                                    <img
                                                        src={user.avatar?.[0]?.path}
                                                        alt="avatar"
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                                                        {user.name?.[0] || "?"}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                </div>
                                            </td>
                                            <td className="p-3">{user.uniId}</td>
                                            <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td className="p-3">{user.books?.length || 0}</td>
                                            <td className="p-3">
                                                {user.uniIdDoc?.[0]?.path ? (
                                                    <a
                                                        href={user.uniIdDoc?.[0]?.path}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 underline"
                                                    >
                                                        View ID
                                                    </a>
                                                ) : "—"}
                                            </td>
                                            <td className="p-3">
                                                <motion.button
                                                    whileHover={{ scale: 1.1, rotate: -5 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 size={20} />
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            ) : (
                                <tr>
                                    <td colSpan={8} className="text-center py-8 text-gray-500">
                                        No users found. Try adjusting your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6">
                        <p className="text-sm text-gray-500">
                            Showing page {currentPage} of {totalPages}
                        </p>
                        <div className="flex gap-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 rounded-lg shadow-sm text-sm ${currentPage === i + 1
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 hover:bg-gray-300"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Confirm Delete Modal */}
            <AnimatePresence>
                {showDeleteModal && selectedUser && (
                    <motion.div
                        key="delete-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg"
                        >
                            <h2 className="text-lg font-semibold mb-2">Confirm Deletion</h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Type <strong>{selectedUser.email}</strong> to confirm user deletion.
                            </p>
                            <input
                                type="email"
                                value={inputEmail}
                                onChange={(e) => setInputEmail(e.target.value)}
                                className="w-full border rounded-md p-2 mb-4"
                                placeholder="Enter email"
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setInputEmail("");
                                    }}
                                    className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
