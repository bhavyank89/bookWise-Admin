import React, { useEffect, useMemo } from 'react';
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';

function DashboardRecentBooks({ loading, recentBooks, SkeletonBox, setLoading, isMounted, setRecentBooks }) {
    const fallbackBooks = useMemo(() => [
        {
            title: "Inside Evil: Inside Evil Series, Book 1",
            author: "Rachel Heng",
            genre: "Strategic, Fantasy",
            requester: "Darrell Stewards",
            createdAt: "12/01/24",
            thumbnail: "https://i.imgur.com/6pK5IQt.png",
        },
        {
            title: "Jayne Castle - People in Glass Houses",
            author: "Rachel Heng",
            genre: "Strategic, Fantasy",
            requester: "Darrell Stewards",
            createdAt: "12/01/24",
            thumbnail: "https://i.imgur.com/FkZ9ReM.png",
        },
        {
            title: "The Great Reclamation: A Novel",
            author: "Rachel Heng",
            genre: "Strategic, Fantasy",
            requester: "Darrell Stewards",
            createdAt: "12/01/24",
            thumbnail: "https://i.imgur.com/XfK6xzH.png",
        },
    ], []);

    useEffect(() => {
        isMounted.current = true;

        const fetchData = async () => {
            setLoading(true);
            try {
                const booksRes = await fetch("http://localhost:4000/book/fetchall");

                if (!booksRes.ok) throw new Error("Request failed");

                const booksData = await booksRes.json();
                if (isMounted.current) {
                    setRecentBooks(booksData.books || []);
                }
            } catch (error) {
                console.error("Fetch failed:", error);
                toast.error("Some data failed to load. Using fallback data.");
                if (isMounted.current) {
                    setRecentBooks(fallbackBooks);
                }
            } finally {
                if (isMounted.current) setLoading(false);
            }
        };

        const timeout = setTimeout(fetchData, 1000);
        return () => {
            clearTimeout(timeout);
            isMounted.current = false;
        };
    }, [fallbackBooks, setLoading, setRecentBooks, isMounted]);

    return (
        <div className="w-full lg:w-1/2 bg-white shadow-md rounded-xl p-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <h2 className="font-bold text-lg">Recently Added Books</h2>
                <a href="#" className="text-sm bg-[#F8F8FF] px-3 py-1 rounded text-[#25388C] hover:underline">
                    View all
                </a>
            </div>

            {/* Add Button */}
            <div className="flex items-center gap-3 mb-4 bg-[#F8F8FF] p-2 rounded-lg hover:bg-[#E2E8F0] transition-colors">
                <button className="flex items-center gap-2 text-sm text-black">
                    <div className="p-2 rounded-full bg-white">
                        <Plus size={16} />
                    </div>
                    Add New Book
                </button>
            </div>

            {/* Scrollable Book List */}
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[340px]">
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
                            {book.thumbnailCloudinary?.secure_url ? (
                                <img
                                    src={book.thumbnailCloudinary?.secure_url}
                                    className="w-14 h-20 rounded object-cover"
                                    alt={book.title}
                                />
                            ) : (
                                <div className="w-14 h-20 rounded bg-[#CBD5E1] flex items-center justify-center font-bold text-white text-xl">
                                    {book.title?.[0] || "B"}
                                </div>
                            )}

                            <div className="flex flex-col justify-center">
                                <h3 className="font-semibold text-sm break-words">{book.title}</h3>
                                <p className="text-xs text-[#64748B]">
                                    By {book.author} • {book.genre}
                                </p>
                                <p className="text-xs text-[#64748B] mt-1">
                                    📅 {book.createdAt
                                        ? new Date(book.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })
                                        : "Unknown Date"}
                                </p>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <p className="text-sm text-gray-400">No recently added books found.</p>
                )}
            </div>
        </div>
    );
}

export default DashboardRecentBooks;
