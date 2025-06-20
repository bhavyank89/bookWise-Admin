'use client';

import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function DashboardBorrowRequest({
  loading,
  borrowRequests,
  SkeletonBox,
  setLoading,
  isMounted,
  setBorrowRequests,
}) {
  const navigate = useNavigate();

  const fallbackBooks = useMemo(
    () => [
      {
        title: "Inside Evil: Inside Evil Series, Book 1",
        author: "Rachel Heng",
        genre: "Strategic, Fantasy",
        requester: "Darrell Stewards",
        date: "2024-01-12",
        thumbnail: "https://i.imgur.com/6pK5IQt.png",
      },
      {
        title: "Jayne Castle - People in Glass Houses",
        author: "Rachel Heng",
        genre: "Strategic, Fantasy",
        requester: "Darrell Stewards",
        date: "2024-01-12",
        thumbnail: "https://i.imgur.com/FkZ9ReM.png",
      },
      {
        title: "The Great Reclamation: A Novel",
        author: "Rachel Heng",
        genre: "Strategic, Fantasy",
        requester: "Darrell Stewards",
        date: "2024-01-12",
        thumbnail: "https://i.imgur.com/XfK6xzH.png",
      },
    ],
    []
  );

  useEffect(() => {
    if (!isMounted || typeof isMounted.current === "undefined") return;

    isMounted.current = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:4000/book/all-requests");
        if (!res.ok) throw new Error("Request failed");

        const data = await res.json();

        if (isMounted.current && data?.requests) {
          const mappedRequests = data.requests.map((req, idx) => {
            let status = "Requested";

            if (req.borrowed && req.returnedAt) {
              status =
                new Date(req.returnedAt) > new Date(req.dueDate)
                  ? "Late Return"
                  : "Returned";
            } else if (req.borrowed) {
              status =
                new Date() > new Date(req.dueDate)
                  ? "Overdue"
                  : "Borrowed";
            }

            return {
              id: idx + 1,
              title: req.title || "Untitled",
              author: req.author || "Unknown Author",
              genre: req.genre || "Unknown Genre",
              requester: req.userName || "Unknown User",
              date: req.requestedAt || req.borrowedAt || null,
              thumbnail:
                req.bookThumbnailCloudinary?.secure_url ||
                req.bookThumbnailCloudinary ||
                req.thumbnailURL ||
                null,
              status,
            };
          });

          setBorrowRequests(mappedRequests);
        }
      } catch (error) {
        console.error("Fetch failed:", error);
        toast.error("Some data failed to load. Using fallback data.");
        if (isMounted.current) {
          setBorrowRequests(fallbackBooks);
        }
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    const timeout = setTimeout(fetchData, 1000);

    return () => {
      clearTimeout(timeout);
      if (isMounted?.current !== undefined) {
        isMounted.current = false;
      }
    };
  }, [fallbackBooks, setBorrowRequests, setLoading, isMounted]);

  return (
    <div className="w-full h-full bg-white shadow-md rounded-xl p-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <h2 className="font-bold text-lg">Borrow Requests</h2>
        <button
          onClick={() => navigate("/borrow-requests")}
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
        ) : borrowRequests.length > 0 ? (
          borrowRequests.map((req, idx) => (
            <motion.div
              whileHover={{ scale: 1.01 }}
              key={idx}
              className="flex items-start gap-3 bg-[#F8F8FF] p-3 rounded-lg transition-shadow hover:shadow-md"
            >
              {req.thumbnail && typeof req.thumbnail === "string" ? (
                <img
                  src={req.thumbnail}
                  className="w-14 h-20 rounded object-cover"
                  alt={req.title}
                />
              ) : (
                <div className="w-14 h-20 rounded bg-[#CBD5E1] flex items-center justify-center font-bold text-white text-xl">
                  {(req.title?.[0] || "B").toUpperCase()}
                </div>
              )}

              <div className="flex flex-col justify-center">
                <h3 className="font-semibold text-sm break-words">
                  {req.title}
                </h3>
                <p className="text-xs text-[#64748B]">
                  By {req.author} • {req.genre}
                </p>
                <p className="text-xs text-[#64748B] mt-1">
                  📚 {req.requester} •{" "}
                  {req.date
                    ? new Date(req.date).toLocaleDateString("en-US", {
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
          <p className="text-sm text-gray-400">No borrow requests found.</p>
        )}
      </div>
    </div>
  );
}

export default DashboardBorrowRequest;
