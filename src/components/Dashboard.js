"use client";

import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

// A simple skeleton component
const SkeletonBox = ({ height = "h-5", width = "w-full" }) => (
    <div className={`bg-gray-300 animate-pulse rounded ${height} ${width}`}></div>
);

function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({
        borrowedBooks: 0,
        totalUsers: 0,
        totalBooks: 0,
    });

    const [borrowRequests, setBorrowRequests] = useState([]);
    const [recentBooks, setRecentBooks] = useState([]);
    const [accountRequests, setAccountRequests] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            const data = [
                {
                    title: "Inside Evil: Inside Evil Series, Book 1",
                    author: "Rachel Heng",
                    genre: "Strategic, Fantasy",
                    requester: "Darrell Stewards",
                    date: "12/01/24",
                    thumbnail: "https://i.imgur.com/6pK5IQt.png",
                },
                {
                    title: "Jayne Castle - People in Glass Houses",
                    author: "Rachel Heng",
                    genre: "Strategic, Fantasy",
                    requester: "Darrell Stewards",
                    date: "12/01/24",
                    thumbnail: "https://i.imgur.com/FkZ9ReM.png",
                },
                {
                    title: "The Great Reclamation: A Novel",
                    author: "Rachel Heng",
                    genre: "Strategic, Fantasy",
                    requester: "Darrell Stewards",
                    date: "12/01/24",
                    thumbnail: "https://i.imgur.com/XfK6xzH.png",
                },
            ];

            const accounts = [
                { name: "Marc Atenson", email: "marcinnc@gmail.com", avatar: "https://i.imgur.com/7YgWqT4.png" },
                { name: "Susan Drake", email: "contact@susandrak.com", initials: "SD" },
                { name: "Ronald Richards", email: "ronaldrichard@gmail.com", initials: "RR" },
            ];

            setSummary({ borrowedBooks: 145, totalUsers: 317, totalBooks: 163 });
            setBorrowRequests(data);
            setRecentBooks(data);
            setAccountRequests(accounts);
            setLoading(false);
        }, 1500);
    }, []);

    return (
        <div className="p-6 flex flex-col gap-6 text-[#1E293B]">
            <div>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="font-bold text-2xl"
                >
                    Welcome, Adrian
                </motion.h1>
                <p className="text-sm text-[#64748B]">Monitor all of your projects and tasks here</p>
            </div>

            {/* Metrics */}
            <div className="flex gap-5">
                {[
                    { label: "Borrowed Books", count: summary.borrowedBooks },
                    { label: "Total Users", count: summary.totalUsers },
                    { label: "Total Books", count: summary.totalBooks },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        className="bg-white w-1/3 shadow-md rounded-xl p-5 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                        whileHover={{ scale: 1.03 }}
                    >
                        <h1 className="font-semibold text-sm text-[#64748B]">{item.label}</h1>
                        {loading ? (
                            <SkeletonBox height="h-8" width="w-1/2" />
                        ) : (
                            <h1 className="font-bold text-2xl">{item.count}</h1>
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="flex gap-6">
                {/* Borrow Requests */}
                <div className="w-1/2 bg-white shadow-md rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg">Borrow Requests</h2>
                        <a href="#" className="text-sm bg-[#F8F8FF] p-2 rounded-sm text-[#25388C] hover:underline">View all</a>
                    </div>

                    <div className="flex flex-col gap-4">
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="flex gap-3 bg-[#F8F8FF] p-3 rounded-lg">
                                    <SkeletonBox height="h-20" width="w-14" />
                                    <div className="flex flex-col gap-2">
                                        <SkeletonBox width="w-40" />
                                        <SkeletonBox width="w-32" />
                                        <SkeletonBox width="w-28" />
                                    </div>
                                </div>
                            ))
                        ) : borrowRequests.length > 0 ? (
                            borrowRequests.map((req, idx) => (
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    key={idx}
                                    className="flex items-start gap-3 bg-[#F8F8FF] p-3 rounded-lg transition-shadow hover:shadow-md"
                                >
                                    <img src={req.thumbnail} className="w-14 h-20 rounded object-cover" alt="book" />
                                    <div>
                                        <h3 className="font-semibold text-sm">{req.title}</h3>
                                        <p className="text-xs text-[#64748B]">By {req.author} • {req.genre}</p>
                                        <p className="text-xs text-[#64748B] mt-1">📚 {req.requester} • {req.date}</p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400">No borrow requests found.</p>
                        )}
                    </div>
                </div>

                {/* Recently Added Books */}
                <div className="w-1/2 bg-white shadow-md rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg">Recently Added Books</h2>
                        <a href="#" className="text-sm bg-[#F8F8FF] p-2 rounded-sm text-[#25388C] hover:underline">View all</a>
                    </div>

                    <div className="flex items-center gap-3 mb-4 bg-[#F8F8FF] p-2 rounded-lg cursor-pointer hover:bg-[#E2E8F0] transition-colors">
                        <button className="flex items-center gap-1 text-sm text-black px-3 py-1">
                            <div className="p-2 rounded-4xl bg-white mr-2"><Plus size={16} /></div> Add New Book
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="flex gap-3">
                                    <SkeletonBox height="h-20" width="w-14" />
                                    <div className="flex flex-col gap-2">
                                        <SkeletonBox width="w-40" />
                                        <SkeletonBox width="w-28" />
                                        <SkeletonBox width="w-24" />
                                    </div>
                                </div>
                            ))
                        ) : recentBooks.length > 0 ? (
                            recentBooks.map((book, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.01 }}
                                    className="flex gap-3 hover:bg-[#F1F5F9] p-2 rounded-lg transition-colors"
                                >
                                    <img src={book.thumbnail} className="w-14 h-20 rounded object-cover" alt="book" />
                                    <div>
                                        <h3 className="font-semibold text-sm">{book.title}</h3>
                                        <p className="text-xs text-[#64748B]">By {book.author} • {book.genre}</p>
                                        <p className="text-xs text-[#64748B] mt-1">📅 {book.date}</p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400">No recently added books found.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Account Requests */}
            <div className="bg-white shadow-md rounded-xl p-5">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-lg">Account Requests</h2>
                    <a href="#" className="text-sm bg-[#F8F8FF] p-2 rounded-sm text-[#25388C] hover:underline">View all</a>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg">
                                <SkeletonBox height="h-10" width="w-10" />
                                <div className="flex flex-col gap-2">
                                    <SkeletonBox width="w-24" />
                                    <SkeletonBox width="w-32" />
                                </div>
                            </div>
                        ))
                    ) : accountRequests.length > 0 ? (
                        accountRequests.map((acc, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg hover:shadow-sm transition"
                            >
                                {acc.avatar ? (
                                    <img src={acc.avatar} className="w-10 h-10 rounded-full" alt={acc.name} />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-[#CBD5E1] flex items-center justify-center font-bold text-white">
                                        {acc.initials}
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium text-sm">{acc.name}</p>
                                    <p className="text-xs text-[#64748B] truncate w-[140px]">{acc.email}</p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-400 col-span-3">No account requests found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
