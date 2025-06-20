import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function DashboardBorrowHistory({
    loading,
    setLoading,
    borrowHistory,
    setBorrowHistory,
    isMounted,
    SkeletonBox,
}) {
    const navigate = useNavigate();

    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

    // ✅ Memoized fallback in case fetch fails
    const fallbackHistory = useMemo(
        () => [
            {
                title: "The Final Empire",
                author: "Brandon Sanderson",
                genre: "Fantasy",
                user: "Alice Johnson",
                date: "2024-05-20",
                thumbnail: "https://i.imgur.com/XfK6xzH.png",
                status: "Returned",
            },
            {
                title: "Atomic Habits",
                author: "James Clear",
                genre: "Self-help",
                user: "Michael Scott",
                date: "2024-05-12",
                thumbnail: "https://i.imgur.com/FkZ9ReM.png",
                status: "Late Return",
            },
            {
                title: "Sapiens",
                author: "Yuval Noah Harari",
                genre: "History",
                user: "Pam Beesly",
                date: "2024-05-10",
                thumbnail: "https://i.imgur.com/6pK5IQt.png",
                status: "Borrowed",
            },
        ],
        []
    );

    useEffect(() => {
        isMounted.current = true;

        const fetchHistory = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${SERVER_URL}/book/all-borrow-history`);
                if (!res.ok) throw new Error("Request failed");

                const { data } = await res.json();
                if (isMounted.current && data) {
                    const mapped = data.map((item, idx) => {
                        let status = "Requested";

                        if (item.borrowedAt && item.returnedAt) {
                            status =
                                new Date(item.returnedAt) > new Date(item.dueDate)
                                    ? "Late Return"
                                    : "Returned";
                        } else if (item.borrowedAt) {
                            status =
                                new Date() > new Date(item.dueDate)
                                    ? "Overdue"
                                    : "Borrowed";
                        }

                        return {
                            id: idx + 1,
                            title: item.bookTitle || "Untitled",
                            author: item.bookAuthor || "Unknown",
                            user: item.userName || "Unknown User",
                            date: item.borrowedAt || item.requestedAt || item.returnedAt,
                            thumbnail:
                                item.bookThumbnailCloudinary?.secure_url ||
                                item.bookThumbnailCloudinary || // sometimes this may be a string
                                item.thumbnailURL ||
                                null,
                            status,
                        };
                    });

                    setBorrowHistory(mapped.slice(0, 5)); // Only 5 recent
                }
            } catch (err) {
                console.error("Borrow history fetch failed:", err);
                toast.error("Failed to fetch borrow history. Showing fallback.");
                if (isMounted.current) setBorrowHistory(fallbackHistory);
            } finally {
                if (isMounted.current) setLoading(false);
            }
        };

        const timeout = setTimeout(fetchHistory, 1000);
        return () => {
            clearTimeout(timeout);
            isMounted.current = false;
        };
    }, [fallbackHistory, setLoading, setBorrowHistory]);

    return (
        <div className="w-full h-full bg-white shadow-md rounded-xl p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <h2 className="font-bold text-lg">Borrow History</h2>
                <button
                    onClick={() => navigate("/borrowHistory")}
                    className="text-sm bg-[#F8F8FF] px-3 py-1 rounded text-[#25388C] hover:underline"
                >
                    View all
                </button>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px] pr-1">
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
                ) : borrowHistory.length > 0 ? (
                    borrowHistory.map((entry, idx) => (
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            key={idx}
                            className="flex items-start gap-3 bg-[#F8F8FF] p-3 rounded-lg transition-shadow hover:shadow-md"
                        >
                            {entry.thumbnail ? (
                                <img
                                    src={entry.thumbnail}
                                    className="w-14 h-20 rounded object-cover"
                                    alt={entry.title}
                                />
                            ) : (
                                <div className="w-14 h-20 rounded bg-[#CBD5E1] flex items-center justify-center font-bold text-white text-xl">
                                    {(entry.title?.[0] || "B").toUpperCase()}
                                </div>
                            )}

                            <div className="flex flex-col justify-center">
                                <h3 className="font-semibold text-sm break-words">
                                    {entry.title}
                                </h3>
                                <p className="text-xs text-[#64748B]">By {entry.author}</p>
                                <p className="text-xs text-[#64748B] mt-1">
                                    👤 {entry.user} •{" "}
                                    {entry.date
                                        ? new Date(entry.date).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })
                                        : "Unknown Date"}{" "}
                                    • {entry.status}
                                </p>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <p className="text-sm text-gray-400">No borrow history found.</p>
                )}
            </div>
        </div>
    );
}

export default DashboardBorrowHistory;
