'use client';

import React, { useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function DashboardRecentBooks({
    loading,
    setLoading,
    recentBooks,
    setRecentBooks,
    SkeletonBox,
    isMounted,
}) {
    const navigate = useNavigate();

    const fallbackBooks = useMemo(
        () => [
            {
                title: "Inside Evil: Inside Evil Series, Book 1",
                author: "Rachel Heng",
                genre: "Strategic, Fantasy",
                createdAt: "2024-12-01T00:00:00Z",
                thumbnail: "https://i.imgur.com/6pK5IQt.png",
            },
            {
                title: "Jayne Castle - People in Glass Houses",
                author: "Rachel Heng",
                genre: "Strategic, Fantasy",
                createdAt: "2024-12-01T00:00:00Z",
                thumbnail: "https://i.imgur.com/FkZ9ReM.png",
            },
            {
                title: "The Great Reclamation: A Novel",
                author: "Rachel Heng",
                genre: "Strategic, Fantasy",
                createdAt: "2024-12-01T00:00:00Z",
                thumbnail: "https://i.imgur.com/XfK6xzH.png",
            },
        ],
        []
    );

    useEffect(() => {
        // ✅ Safe check before using isMounted
        if (!isMounted || typeof isMounted.current === "undefined") return;

        isMounted.current = true;

        const fetchBooks = async () => {
            setLoading(true);
            try {
                const res = await fetch("http://localhost:4000/book/fetchall");
                if (!res.ok) throw new Error("Request failed");

                const { books } = await res.json();
                if (isMounted.current) {
                    setRecentBooks(books || []);
                }
            } catch (err) {
                console.error("Fetch failed:", err);
                toast.error("Failed to fetch recent books. Showing fallback.");
                if (isMounted.current) {
                    setRecentBooks(fallbackBooks);
                }
            } finally {
                if (isMounted.current) setLoading(false);
            }
        };

        const timeout = setTimeout(fetchBooks, 1000);
        return () => {
            clearTimeout(timeout);
            if (isMounted?.current !== undefined) {
                isMounted.current = false;
            }
        };
    }, [fallbackBooks, setLoading, setRecentBooks, isMounted]);

    return (
        <div className="w-full h-full bg-white shadow-md rounded-xl p-5">
            {/* 🔹 Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <h2 className="font-bold text-lg">Recently Added Books</h2>
                <button
                    onClick={() => navigate("/all-books")}
                    className="text-sm bg-[#F8F8FF] px-3 py-1 rounded text-[#25388C] hover:underline"
                >
                    View all
                </button>
            </div>

            {/* 🔹 Add Book Button */}
            <div className="flex items-center gap-3 mb-4 bg-[#F8F8FF] p-2 rounded-lg hover:bg-[#E2E8F0] transition-colors">
                <button
                    onClick={() => navigate("/createBook")}
                    className="flex items-center gap-2 text-sm text-black"
                >
                    <div className="p-2 rounded-full bg-white">
                        <Plus size={16} />
                    </div>
                    Add New Book
                </button>
            </div>

            {/* 🔹 Scrollable Book List */}
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[340px] pr-1">
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
                    recentBooks.map((book, idx) => {
                        const imageSrc =
                            book?.thumbnailCloudinary?.secure_url ||
                            book?.thumbnailCloudinary ||
                            book?.thumbnailURL ||
                            book?.thumbnail;

                        return (
                            <motion.div
                                key={idx}
                                onClick={() => navigate(`/bookDetails/${book._id}`)}
                                whileHover={{ scale: 1.01 }}
                                className="flex gap-3 hover:bg-[#F1F5F9] p-2 rounded-lg transition-colors cursor-pointer"
                            >
                                {imageSrc ? (
                                    <img
                                        src={imageSrc}
                                        className="w-14 h-20 rounded object-cover"
                                        alt={book.title}
                                    />
                                ) : (
                                    <div className="w-14 h-20 rounded bg-[#CBD5E1] flex items-center justify-center font-bold text-white text-xl">
                                        {(book.title?.[0] || "B").toUpperCase()}
                                    </div>
                                )}

                                <div className="flex flex-col justify-center">
                                    <h3 className="font-semibold text-sm break-words">{book.title}</h3>
                                    <p className="text-xs text-[#64748B]">
                                        By {book.author} • {book.genre}
                                    </p>
                                    <p className="text-xs text-[#64748B] mt-1">
                                        📅{" "}
                                        {book.createdAt
                                            ? new Date(book.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })
                                            : "Unknown Date"}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <p className="text-sm text-gray-400">No recently added books found.</p>
                )}
            </div>
        </div>
    );
}

export default DashboardRecentBooks;
