import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import DashboardBorrowRequest from "./DashboardBorrowRequest";
import DashboardRecentBooks from "./DashboardRecentBooks";
import DashboardAccountRequest from "./DashboardAccountRequest";
import DashboardBorrowHistory from "./DashboardBorrowHistory";
import UnverifiedUserModal from "./unvarifiedUser";

const SkeletonBox = ({ height = "h-5", width = "w-full" }) => (
    <div className={`bg-gray-300 animate-pulse rounded ${height} ${width}`} />
);

function Dashboard({ activeUser }) {
    const [loading, setLoading] = useState(true);
    const [borrowRequests, setBorrowRequests] = useState([]);
    const [recentBooks, setRecentBooks] = useState([]);
    const [accountRequests, setAccountRequests] = useState([]);
    const [borrowHistory, setBorrowHistory] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Show unverified modal once per session
    useEffect(() => {
        if (activeUser?.isVerified === false) {
            const hasSeenModal = sessionStorage.getItem("adminHasSeenUnverifiedModal");
            if (!hasSeenModal) {
                setIsModalOpen(true);
                sessionStorage.setItem("adminHasSeenUnverifiedModal", "true");
            }
        }
    }, [activeUser]);

    const closeModal = () => setIsModalOpen(false);
    const handleExplore = () => setIsModalOpen(false);
    const isMounted = useRef(true);

    return (
        <div className="min-h-screen w-full bg-gray-50">
            {/* Unverified User Modal */}
            <UnverifiedUserModal
                closeModal={closeModal}
                isModalOpen={isModalOpen}
                handleExplore={handleExplore}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <header className="mb-6 lg:mb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="font-bold text-2xl sm:text-3xl lg:text-4xl text-[#1E293B] mb-2"
                    >
                        Welcome, {activeUser?.name || "User"}
                    </motion.h1>
                    <p className="text-sm sm:text-base text-[#64748B]">
                        Monitor all of your projects and tasks here.
                    </p>
                </header>

                {/* Metrics */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-8">
                    {[
                        { label: "Total Users", value: accountRequests.length },
                        { label: "Total Books", value: recentBooks.length },
                        { label: "Borrow Requests", value: borrowRequests.length },
                        { label: "Total Borrowed", value: borrowHistory.length },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            className="bg-white shadow-md border border-gray-100 rounded-xl p-4 sm:p-5 lg:p-6 hover:shadow-xl transition-all duration-300"
                            whileHover={{ scale: 1.02, y: -2 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xs sm:text-sm font-semibold text-[#64748B] uppercase tracking-wide">
                                    {item.label}
                                </h3>
                            </div>
                            {loading ? (
                                <SkeletonBox height="h-8 sm:h-10" width="w-1/2" />
                            ) : (
                                <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-[#1E293B]">
                                    {item.value}
                                </h2>
                            )}
                        </motion.div>
                    ))}
                </section>

                {/* Main Grid */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 mb-8">
                    <motion.div
                        className="col-span-12 md:col-span-6 lg:col-span-4 bg-white border border-gray-100 shadow-md rounded-xl h-full min-h-[400px]"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <DashboardBorrowRequest
                            loading={loading}
                            borrowRequests={borrowRequests}
                            SkeletonBox={SkeletonBox}
                            setLoading={setLoading}
                            setBorrowRequests={setBorrowRequests}
                            isMounted={isMounted}
                        />
                    </motion.div>

                    <motion.div
                        className="col-span-12 md:col-span-6 lg:col-span-4 bg-white border border-gray-100 shadow-md rounded-xl h-full min-h-[400px]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <DashboardRecentBooks
                            loading={loading}
                            recentBooks={recentBooks}
                            SkeletonBox={SkeletonBox}
                            setLoading={setLoading}
                            setRecentBooks={setRecentBooks}
                            isMounted={isMounted}
                            activeUser={activeUser}
                        />
                    </motion.div>

                    <motion.div
                        className="col-span-12 md:col-span-12 lg:col-span-4 bg-white border border-gray-100 shadow-md rounded-xl h-full min-h-[400px]"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <DashboardBorrowHistory
                            loading={loading}
                            borrowHistory={borrowHistory}
                            setLoading={setLoading}
                            setBorrowHistory={setBorrowHistory}
                            SkeletonBox={SkeletonBox}
                            isMounted={isMounted}
                        />
                    </motion.div>
                </section>

                {/* Full Width Account Requests */}
                <motion.section
                    className="bg-white border border-gray-100 shadow-md rounded-xl p-4 sm:p-5 lg:p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <DashboardAccountRequest
                        loading={loading}
                        accountRequests={accountRequests}
                        SkeletonBox={SkeletonBox}
                        setLoading={setLoading}
                        setAccountRequests={setAccountRequests}
                        isMounted={isMounted}
                    />
                </motion.section>
            </div>
        </div>
    );
}

export default Dashboard;
