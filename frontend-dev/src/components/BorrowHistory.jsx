import { useEffect, useState, useCallback } from "react";
import { ChevronDown, X } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

import Modal from './lib/PrintModel';
import Pagination from './Pagination';
import UserSearchDropdown from "./UserSearchDropdown";
import BorrowHistoryTable from "./BorrowHistoryTable";

const Skeleton = ({ height = 20, width = "100%" }) => (
    <div
        className="bg-gray-200 animate-pulse rounded"
        style={{ height: `${height}px`, width }}
    ></div>
);

export default function BorrowHistory({ activeUser = { name: "Admin" } }) {
    const [sortAsc, setSortAsc] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBorrowData, setSelectedBorrowData] = useState(null);

    const requestsPerPage = 10;

    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    const fetchAllBorrowHistory = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${SERVER_URL}/book/all-borrow-history`);
            const result = await response.json();

            if (result.success && result.data) {
                const mappedData = result.data.map((item, idx) => {
                    // Determine status based on the data
                    let status = "Requested";
                    if (item.borrowedAt && item.returnedAt) {
                        // Check if returned late
                        const returnDate = new Date(item.returnedAt);
                        const dueDate = new Date(item.dueDate);
                        status = returnDate > dueDate ? "Late Return" : "Returned";
                    } else if (item.borrowedAt) {
                        // Check if currently overdue
                        const now = new Date();
                        const dueDate = new Date(item.dueDate);
                        status = now > dueDate ? "Overdue" : "Borrowed";
                    }

                    return {
                        id: idx + 1,
                        bookId: item.bookId || "Unknown",
                        bookTitle: item.bookTitle || "Untitled",
                        bookAuthor: item.bookAuthor || "Unknown Author",
                        userId: item.userId || "Unknown User",
                        userName: item.userName || "Unknown User",
                        userEmail: item.userEmail || "N/A",
                        uniId: item.userUniId || `UNI${String(idx + 1).padStart(3, '0')}`,
                        status: status,
                        requested: item.requestedAt ? new Date(item.requestedAt).toLocaleDateString() : "—",
                        borrowed: item.borrowedAt ? new Date(item.borrowedAt).toLocaleDateString() : "—",
                        dueDate: item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "—",
                        returned: item.returnedAt ? new Date(item.returnedAt).toLocaleDateString() : "—",
                        bookThumbnail: item.bookThumbnailCloudinary?.secure_url || null,
                        thumbanilURL: item.thumbanilURL || null,
                        userAvatar: item.userAvatar || "",
                        // Store original dates for sorting
                        borrowedAtRaw: item.borrowedAt,
                        requestedAtRaw: item.requestedAt,
                        returnedAtRaw: item.returnedAt,
                        dueDateRaw: item.dueDate,
                        lateFine: item.lateFine || 0,
                    };
                });

                setData(mappedData);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error("Failed to fetch borrow history:", error);
            toast.error("Failed to fetch borrow history");
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [SERVER_URL])

    const fetchUserBorrowHistory = useCallback(async (userId) => {
        setLoading(true);
        try {
            const response = await fetch(`${SERVER_URL}/book/borrowedHistory`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_Id: userId })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success && result.history) {
                const historyArray = Array.isArray(result.history) ? result.history : [result.history];

                if (historyArray.length === 0) {
                    setData([]);
                    return;
                }

                const mappedData = historyArray.map((item, idx) => {
                    // Determine status based on the data
                    let status = "Requested";
                    if (item.borrowedAt && item.returnedAt) {
                        // Check if returned late
                        const returnDate = new Date(item.returnedAt);
                        const dueDate = new Date(item.dueDate);
                        status = returnDate > dueDate ? "Late Return" : "Returned";
                    } else if (item.borrowedAt) {
                        // Check if currently overdue
                        const now = new Date();
                        const dueDate = new Date(item.dueDate);
                        status = now > dueDate ? "Overdue" : "Borrowed";
                    }

                    return {
                        id: idx + 1,
                        bookId: item.bookId || "Unknown",
                        bookTitle: item.title || item.bookTitle || "Untitled",
                        bookAuthor: item.author || item.bookAuthor || "Unknown Author",
                        userId: item.userId || "Unknown User",
                        userName: item.userName || "Unknown User",
                        userEmail: item.userEmail || "N/A",
                        uniId: item.uniId || item.userUniId || `UNI${String(idx + 1).padStart(3, '0')}`,
                        status: status,
                        requested: item.requestedAt ? new Date(item.requestedAt).toLocaleDateString() : "—",
                        borrowed: item.borrowedAt ? new Date(item.borrowedAt).toLocaleDateString() : "—",
                        dueDate: item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "—",
                        returned: item.returnedAt ? new Date(item.returnedAt).toLocaleDateString() : "—",
                        bookThumbnail: item.bookThumbnail?.secure_url || null,
                        thumbanilURL: item.thumbanilURL || null,
                        userAvatar: item.userAvatar || "",
                        // Store original dates for sorting
                        borrowedAtRaw: item.borrowedAt,
                        requestedAtRaw: item.requestedAt,
                        returnedAtRaw: item.returnedAt,
                        dueDateRaw: item.dueDate,
                        lateFine: item.lateFine || 0,
                    };
                });

                setData(mappedData);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error("Failed to fetch user borrow history:", error);
            toast.error("Failed to fetch user borrow history");
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [SERVER_URL])

    useEffect(() => {
        setCurrentPage(1); // Reset to first page when user changes

        if (selectedUser && selectedUser._id) {
            fetchUserBorrowHistory(selectedUser._id);
        } else {
            fetchAllBorrowHistory();
        }
    }, [selectedUser, fetchAllBorrowHistory, fetchUserBorrowHistory]);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setStatusFilter("All"); // Reset status filter when changing users
    };

    const handleGenerateDetails = (item) => {
        setSelectedBorrowData(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedBorrowData(null);
    };

    const filtered = data.filter((item) => {
        const matchesStatus = statusFilter === "All" || item.status === statusFilter;
        return matchesStatus;
    });

    const sorted = [...filtered].sort((a, b) => {
        // Use the requested date for sorting, fallback to current date if not available
        const dateA = new Date(a.requestedAtRaw || new Date());
        const dateB = new Date(b.requestedAtRaw || new Date());
        return sortAsc ? dateA - dateB : dateB - dateA;
    });

    const indexOfLast = currentPage * requestsPerPage;
    const currentItems = sorted.slice(indexOfLast - requestsPerPage, indexOfLast);

    const uniqueStatuses = ["All", ...new Set(data.map(item => item.status))];

    return (
        <div className="p-4 sm:p-6 mb-14 bg-gray-50 min-h-screen font-sans">
            <Toaster position="top-right" />
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                        Welcome, {activeUser.name}
                    </h1>
                    <p className="text-sm text-gray-500">Monitor all borrow history records here</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 flex-wrap">
                    <UserSearchDropdown
                        onSelectUser={handleUserSelect}
                        selectedUser={selectedUser}
                    />
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setSortAsc(!sortAsc)}
                            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition text-sm"
                            aria-label="Sort by requested date"
                        >
                            {sortAsc ? "Oldest to Recent" : "Recent to Oldest"}
                            <ChevronDown size={16} />
                        </button>
                    </div>
                </div>

                <BorrowHistoryTable
                    loading={loading}
                    currentItems={currentItems}
                    requestsPerPage={requestsPerPage}
                    handleGenerateDetails={handleGenerateDetails}
                    Skeleton={Skeleton}
                    activeUser={activeUser}
                />

                <Pagination
                    totalPages={Math.ceil(sorted.length / requestsPerPage)}
                    itemsPerPage={requestsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    theme="dark"
                />

            </div>

            {/* Modal Component */}
            {modalOpen && selectedBorrowData && (
                <Modal
                    borrowData={selectedBorrowData}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}