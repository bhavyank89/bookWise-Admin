import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PaginationControls from "./Pagination";

const mockData = [
    {
        id: 1,
        bookTitle: "The Great Reclamation...",
        userName: "Darrell Steward",
        userEmail: "steward@gmail.com",
        uniId: "UNI001",
        status: "Borrowed",
        borrowed: "Dec 19 2023",
        returnDate: "Dec 29 2023",
        dueDate: "Dec 31 2023",
        lateFine: 0,
        bookThumbnail: "https://via.placeholder.com/40x60?text=Book1",
        userAvatar: "https://i.pravatar.cc/40?u=darrell",
    },
    {
        id: 2,
        bookTitle: "Inside Evil: Inside Evil...",
        userName: "Marc Atenson",
        userEmail: "marcinee@mial.com",
        uniId: "UNI002",
        status: "Late Return",
        borrowed: "Dec 21 2024",
        returnDate: "Jan 17 2024",
        dueDate: "Jan 12 2024",
        lateFine: 25,
        bookThumbnail: "https://via.placeholder.com/40x60?text=Book2",
        userAvatar: "https://i.pravatar.cc/40?u=marc",
    },
    {
        id: 3,
        bookTitle: "Jayne Castle - People...",
        userName: "Susan Drake",
        userEmail: "contact@susandrake.io",
        uniId: "UNI003",
        status: "Returned",
        borrowed: "Dec 31 2023",
        returnDate: "Jan 15 2023",
        dueDate: "Jan 25 2023",
        lateFine: 0,
        bookThumbnail: "https://via.placeholder.com/40x60?text=Book3",
        userAvatar: "",
    },
    {
        id: 4,
        bookTitle: "The Great Reclamation...",
        userName: "David Smith",
        userEmail: "davide@yahoo.com",
        uniId: "UNI004",
        status: "Requested",
        borrowed: "Dec 19 2023",
        returnDate: "",
        dueDate: "Dec 31 2023",
        lateFine: 0,
        bookThumbnail: "https://via.placeholder.com/40x60?text=Book1",
        userAvatar: "https://i.pravatar.cc/40?u=david",
    },
];

const Skeleton = ({ height = 20, width = "100%" }) => (
    <div
        className="bg-gray-200 animate-pulse rounded"
        style={{ height: `${height}px`, width }}
    ></div>
);

export default function BorrowRequests({ activeUser = { name: "Admin" } }) {
    const [search, setSearch] = useState("");
    const [sortAsc, setSortAsc] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");
    const [actionLoading, setActionLoading] = useState({});
    const navigate = useNavigate();

    const requestsPerPage = 10;

    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

    const fetchData = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/book/all-requests`);
            const result = await response.json();

            const mappedData = result.requests.map((req, idx) => {
                let status = "Requested";
                if (req.borrowed && req.returnedAt) {
                    const returnDate = new Date(req.returnedAt);
                    const dueDate = new Date(req.dueDate);
                    status = returnDate > dueDate ? "Late Return" : "Returned";
                } else if (req.borrowed) {
                    const now = new Date();
                    const dueDate = new Date(req.dueDate);
                    status = now > dueDate ? "Overdue" : "Borrowed";
                }

                return {
                    id: idx + 1,
                    bookId: req.bookId || "Unknown",
                    bookTitle: req.title || "Untitled",
                    userId: req.userId || "Unknown User",
                    userName: req.userName || "Unknown User",
                    userEmail: req.userEmail || "N/A",
                    uniId: req.uniId || `UNI${String(idx + 1).padStart(3, "0")}`,
                    status: status,
                    requested: req.requestedAt
                        ? new Date(req.requestedAt).toLocaleDateString()
                        : "—",
                    borrowed: req.borrowedAt
                        ? new Date(req.borrowedAt).toLocaleDateString()
                        : "—",
                    dueDate: req.dueDate
                        ? new Date(req.dueDate).toLocaleDateString()
                        : "—",
                    bookThumbnail:
                        req.bookThumbnailCloudinary?.secure_url ||
                        req.thumbnailURL ||
                        null,
                    userAvatar: req.userThumbnailCloudinary?.[0]?.path || "",
                    borrowedAtRaw: req.borrowedAt,
                    requestedAtRaw: req.requestedAt,
                    dueDateRaw: req.dueDate,
                    lateFine: req.lateFine || 0,
                };
            });

            setData(mappedData);
        } catch (error) {
            console.error("Failed to fetch:", error);
            setData(mockData); // fallback to mock
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setTimeout(fetchData, 1000);
    }, []);

    const getActionButton = (item) => {
        if (item.status === "Borrowed" || item.status === "Overdue") {
            return { text: "Return Book", action: "return" };
        } else if (item.status === "Requested") {
            return { text: "Issue", action: "issue" };
        }
        return null;
    };

    const handleAction = async (action, item) => {
        const actionKey = `${action}-${item.id}`;
        setActionLoading((prev) => ({ ...prev, [actionKey]: true }));

        const url =
            action === "return"
                ? `${SERVER_URL}/book/return`
                : `${SERVER_URL}/book/borrow`;

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await fetch(`${url}/${item.bookId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_Id: item.userId }),
            });

            const data = await response.json();
            if (!data.success) {
                toast.error(
                    action === "return" ? "Failed to return book" : "Failed to issue book"
                );
            } else {
                toast.success(
                    action === "return"
                        ? "Book returned successfully!"
                        : "Book issued successfully!"
                );
                await fetchData();
            }
        } catch (error) {
            toast.error(
                action === "return" ? "Error returning book" : "Error issuing book"
            );
        } finally {
            setActionLoading((prev) => ({ ...prev, [actionKey]: false }));
        }
    };

    const filtered = data.filter((item) => {
        const term = search.toLowerCase();
        const matchesSearch =
            item.bookTitle.toLowerCase().includes(term) ||
            item.userName.toLowerCase().includes(term) ||
            item.userEmail.toLowerCase().includes(term) ||
            item.uniId.toLowerCase().includes(term);

        const matchesStatus = statusFilter === "All" || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const sorted = [...filtered].sort((a, b) => {
        const dateA = new Date(a.requestedAtRaw || new Date());
        const dateB = new Date(b.requestedAtRaw || new Date());
        return sortAsc ? dateA - dateB : dateB - dateA;
    });

    const indexOfLast = currentPage * requestsPerPage;
    const currentItems = sorted.slice(indexOfLast - requestsPerPage, indexOfLast);
    const totalPages = Math.ceil(sorted.length / requestsPerPage);
    const uniqueStatuses = ["All", ...new Set(data.map((item) => item.status))];

    return (
        <div className="p-4 sm:p-6 mb-14 bg-gray-50 min-h-screen font-sans">
            <Toaster position="top-right" />
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                        Welcome, {activeUser.name}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Monitor all of your projects and tasks here
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 flex-wrap">
                    <input
                        type="text"
                        placeholder="Search users, books by title, author, uniId or genre."
                        className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <div className="flex gap-2 flex-wrap">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            {uniqueStatuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => setSortAsc(!sortAsc)}
                            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition text-sm"
                        >
                            {sortAsc ? "Oldest to Recent" : "Recent to Oldest"}
                            <ChevronDown size={16} />
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
                        Borrow Book Requests
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left table-fixed min-w-[900px]">
                            <thead>
                                <tr className="text-gray-600 bg-gray-50">
                                    <th className="py-3 px-4 w-1/5 font-medium">Book</th>
                                    <th className="py-3 px-4 w-1/5 font-medium">User Requested</th>
                                    <th className="py-3 px-4 w-1/10 font-medium">Status</th>
                                    <th className="py-3 px-4 w-1/10 font-medium">Requested</th>
                                    <th className="py-3 px-4 w-1/10 font-medium">Borrowed</th>
                                    <th className="py-3 px-4 w-1/10 font-medium">Due On</th>
                                    <th className="py-3 px-4 w-1/10 font-medium">Late Fine</th>
                                    <th className="py-3 px-4 w-1/10 font-medium text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: requestsPerPage }).map((_, i) => (
                                        <tr key={i} className="border-b">
                                            {Array.from({ length: 8 }).map((_, j) => (
                                                <td key={j} className="py-4 px-4">
                                                    <Skeleton height={20} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : currentItems.length > 0 ? (
                                    currentItems.map((item) => {
                                        const actionButton = getActionButton(item);
                                        const actionKey = `${actionButton?.action}-${item.id}`;
                                        const isActionLoading = actionLoading[actionKey];

                                        return (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-gray-50 transition-all duration-200 border-b"
                                            >
                                                <td onClick={() => { navigate(`/bookdetails/${item.bookId}`) }} className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        {item?.bookThumbnail ? (<img
                                                            src={item.bookThumbnail}
                                                            alt="Book cover"
                                                            className="w-10 h-14 object-cover rounded shadow"
                                                        />
                                                        ) : (
                                                            <div className="w-10 h-14 bg-blue-100 text-blue-700 rounded shadow flex items-center justify-center font-bold text-xl">
                                                                {item.bookTitle?.[0]?.toUpperCase() || 'B'}
                                                            </div>
                                                        )}
                                                        <span className="font-medium text-gray-800 truncate">
                                                            {item.bookTitle}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        {item.userAvatar ? (
                                                            <img
                                                                src={item.userAvatar}
                                                                alt="User avatar"
                                                                className="w-8 h-8 rounded-full object-cover shadow"
                                                            />
                                                        ) : (
                                                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                                {item.userName ? item.userName[0] : "?"}
                                                            </div>
                                                        )}
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-medium text-gray-700 truncate">
                                                                {item.userName}
                                                            </div>
                                                            <div className="text-xs text-gray-500 truncate">
                                                                {item.userEmail}
                                                            </div>
                                                            <div className="text-xs text-gray-400 truncate">{item.uniId}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span
                                                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${item.status === "Returned"
                                                            ? "text-blue-600 bg-blue-100"
                                                            : item.status === "Late Return" || item.status === "Overdue"
                                                                ? "text-red-600 bg-red-100"
                                                                : item.status === "Borrowed"
                                                                    ? "text-green-600 bg-green-100"
                                                                    : "text-purple-600 bg-purple-100"
                                                            }`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-gray-700">{item.requested}</td>
                                                <td className="py-4 px-4 text-gray-700">{item.borrowed}</td>
                                                <td className="py-4 px-4 text-gray-700">{item.dueDate}</td>
                                                <td className="py-4 px-4 text-gray-700">
                                                    {item.lateFine > 0 ? `₹${item.lateFine}` : "-"}
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <button
                                                        onClick={() => handleAction(actionButton.action, item)}
                                                        disabled={isActionLoading || !activeUser.isVerified}
                                                        className={`px-3 py-1 rounded text-xs font-medium transition ${actionButton.action === "return"
                                                            ? "text-orange-600 hover:text-orange-800 hover:bg-orange-50"
                                                            : "text-green-600 hover:text-green-800 hover:bg-green-50"
                                                            } ${isActionLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                                        aria-label={actionButton.text}
                                                    >
                                                        {isActionLoading
                                                            ? (actionButton.action === "return" ? "Returning..." : "Issuing...")
                                                            : actionButton.text
                                                        }
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="text-center py-8 text-gray-500">
                                            No results found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ✅ PAGINATION FIXED */}
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        theme="dark"
                    />
                </div>
            </div>
        </div>
    );
}
