"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import DashboardBorrowRequest from "./DashboardBorrowRequest";
import DashboardRecentBooks from "./DashboardRecentBooks";
import DashboardAccountRequest from "./DashboardAccountRequest";

// Skeleton UI Component
const SkeletonBox = ({ height = "h-5", width = "w-full" }) => (
    <div className={`bg-gray-300 animate-pulse rounded ${height} ${width}`} />
);

function Dashboard({ activeUser }) {
    const [loading, setLoading] = useState(true);

    const [borrowRequests, setBorrowRequests] = useState([]);
    const [recentBooks, setRecentBooks] = useState([]);
    const [accountRequests, setAccountRequests] = useState([]);

    const isMounted = useRef(true);

    return (
        <div className="p-6 flex flex-col gap-6 text-[#1E293B]">
            {/* Header */}
            <div>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="font-bold text-2xl"
                >
                    Welcome, {activeUser?.name || "User"}
                </motion.h1>
                <p className="text-sm text-[#64748B]">
                    Monitor all of your projects and tasks here
                </p>
            </div>

            {/* Metrics */}
            <div className="flex gap-5">
                <motion.div
                    className="bg-white w-1/3 shadow-md rounded-xl p-5 hover:shadow-xl transition-shadow duration-300"
                    whileHover={{ scale: 1.03 }}
                >
                    <h1 className="font-semibold text-sm text-[#64748B]">Total Users</h1>
                    {loading ? (
                        <SkeletonBox height="h-8" width="w-1/2" />
                    ) : (
                        <h1 className="font-bold text-2xl">{accountRequests.length}</h1>
                    )}
                </motion.div>

                <motion.div
                    className="bg-white w-1/3 shadow-md rounded-xl p-5 hover:shadow-xl transition-shadow duration-300"
                    whileHover={{ scale: 1.03 }}
                >
                    <h1 className="font-semibold text-sm text-[#64748B]">Total Books</h1>
                    {loading ? (
                        <SkeletonBox height="h-8" width="w-1/2" />
                    ) : (
                        <h1 className="font-bold text-2xl">{recentBooks.length}</h1>
                    )}
                </motion.div>

                <motion.div
                    className="bg-white w-1/3 shadow-md rounded-xl p-5 hover:shadow-xl transition-shadow duration-300"
                    whileHover={{ scale: 1.03 }}
                >
                    <h1 className="font-semibold text-sm text-[#64748B]">Borrow Requests</h1>
                    {loading ? (
                        <SkeletonBox height="h-8" width="w-1/2" />
                    ) : (
                        <h1 className="font-bold text-2xl">{borrowRequests.length}</h1>
                    )}
                </motion.div>
            </div>

            {/* Panels */}
            <div className="flex gap-6">
                <DashboardBorrowRequest
                    loading={loading}
                    borrowRequests={borrowRequests}
                    SkeletonBox={SkeletonBox}
                    setLoading={setLoading}
                    setBorrowRequests={setBorrowRequests}
                    isMounted={isMounted}
                />
                <DashboardRecentBooks
                    loading={loading}
                    recentBooks={recentBooks}
                    SkeletonBox={SkeletonBox}
                    setLoading={setLoading}
                    setRecentBooks={setRecentBooks}
                    isMounted={isMounted}
                />
            </div>

            {/* Account Requests */}
            <div className="bg-white shadow-md rounded-xl p-5">
                <DashboardAccountRequest
                    loading={loading}
                    accountRequests={accountRequests}
                    SkeletonBox={SkeletonBox}
                    setLoading={setLoading}
                    isMounted={isMounted}
                    setAccountRequests={setAccountRequests}
                />
            </div>
        </div>
    );
}

export default Dashboard;
