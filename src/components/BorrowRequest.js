import { useEffect, useState } from "react";
import { FileText, ChevronDown } from "lucide-react";

const mockData = [
    {
        id: 1,
        bookTitle: "The Great Reclamation...",
        userName: "Darrell Steward",
        userEmail: "steward@gmail.com",
        status: "Borrowed",
        borrowed: "Dec 19 2023",
        returnDate: "Dec 29 2023",
        dueDate: "Dec 31 2023",
        bookThumbnail: "https://via.placeholder.com/40x60?text=Book1",
        userAvatar: "https://i.pravatar.cc/40?u=darrell"
    },
    {
        id: 2,
        bookTitle: "Inside Evil: Inside Evil...",
        userName: "Marc Atenson",
        userEmail: "marcinee@mial.com",
        status: "Late Return",
        borrowed: "Dec 21 2024",
        returnDate: "Jan 17 2024",
        dueDate: "Jan 12 2024",
        bookThumbnail: "https://via.placeholder.com/40x60?text=Book2",
        userAvatar: "https://i.pravatar.cc/40?u=marc"
    },
    {
        id: 3,
        bookTitle: "Jayne Castle - People...",
        userName: "Susan Drake",
        userEmail: "contact@susandrake.io",
        status: "Returned",
        borrowed: "Dec 31 2023",
        returnDate: "Jan 15 2023",
        dueDate: "Jan 25 2023",
        bookThumbnail: "https://via.placeholder.com/40x60?text=Book3",
        userAvatar: ""
    },
    {
        id: 4,
        bookTitle: "The Great Reclamation...",
        userName: "David Smith",
        userEmail: "davide@yahoo.com",
        status: "Borrowed",
        borrowed: "Dec 19 2023",
        returnDate: "Dec 29 2023",
        dueDate: "Dec 31 2023",
        bookThumbnail: "https://via.placeholder.com/40x60?text=Book1",
        userAvatar: "https://i.pravatar.cc/40?u=david"
    }
];

const Skeleton = ({ height = 20, width = "100%" }) => (
    <div
        className="bg-gray-200 animate-pulse rounded"
        style={{ height: `${height}px`, width }}
    ></div>
);

export default function BorrowRequests() {
    const [search, setSearch] = useState("");
    const [sortAsc, setSortAsc] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const requestsPerPage = 2;

    useEffect(() => {
        setTimeout(async () => {
            try {
                const response = await fetch("http://localhost:4000/book/all-borrow-requests");
                const result = await response.json();

                console.log(result);

                const mappedData = result.requests.map((req, idx) => {
                    // Determine status based on the data
                    let status = "Requested";
                    if (req.borrowed && req.returnedAt) {
                        // Check if returned late
                        const returnDate = new Date(req.returnedAt);
                        const dueDate = new Date(req.dueDate);
                        status = returnDate > dueDate ? "Late Return" : "Returned";
                    } else if (req.borrowed) {
                        // Check if currently overdue
                        const now = new Date();
                        const dueDate = new Date(req.dueDate);
                        status = now > dueDate ? "Overdue" : "Borrowed";
                    }

                    return {
                        id: idx + 1,
                        bookId: req.bookId || "Unknown",
                        bookTitle: req.title || "Untitled",
                        userId: req.user || "Unknown User",
                        userName: req.userName || "Unknown User",
                        userEmail: req.userEmail || "N/A",
                        status: status,
                        borrowed: req.borrowedAt ? new Date(req.borrowedAt).toLocaleDateString() : "—",
                        returnDate: req.returnedAt ? new Date(req.returnedAt).toLocaleDateString() : "—",
                        dueDate: req.dueDate ? new Date(req.dueDate).toLocaleDateString() : "—",
                        bookThumbnail: req.bookThumbnailCloudinary?.secure_url || `https://via.placeholder.com/40x60?text=${req.title ? req.title[0] : "B"}`,
                        userAvatar: req.userThumbnailCloudinary?.[0]?.path || "",
                        // Store original dates for sorting
                        borrowedAtRaw: req.borrowedAt,
                        returnedAtRaw: req.returnedAt,
                        dueDateRaw: req.dueDate
                    };
                });

                setData(mappedData);
            } catch (error) {
                console.error("Failed to fetch:", error);
                setData(mockData); // fallback to mock data
            } finally {
                setLoading(false);
            }
        }, 1000);
    }, []);

    const filtered = data.filter((item) => {
        const term = search.toLowerCase();
        return (
            item.bookTitle.toLowerCase().includes(term) ||
            item.userName.toLowerCase().includes(term) ||
            item.userEmail.toLowerCase().includes(term)
        );
    });

    const sorted = [...filtered].sort((a, b) => {
        // Use the raw date for sorting, fallback to borrowed date
        const dateA = new Date(a.borrowedAtRaw || a.borrowed);
        const dateB = new Date(b.borrowedAtRaw || b.borrowed);
        return sortAsc ? dateA - dateB : dateB - dateA;
    });

    const indexOfLast = currentPage * requestsPerPage;
    const currentItems = sorted.slice(indexOfLast - requestsPerPage, indexOfLast);

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-1">Welcome, Adrian</h1>
                    <p className="text-sm text-gray-500">Monitor all of your projects and tasks here</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <input
                        type="text"
                        placeholder="Search users, books by title, author, or genre."
                        className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        aria-label="Search"
                    />
                    <button
                        onClick={() => setSortAsc(!sortAsc)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition"
                        aria-label="Sort by borrowed date"
                    >
                        {sortAsc ? "Oldest to Recent" : "Recent to Oldest"}
                        <ChevronDown size={16} />
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Borrow Book Requests</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left table-fixed">
                            <thead>
                                <tr className="text-gray-600 bg-gray-50">
                                    <th className="py-3 px-4 w-1/4 font-medium">Book</th>
                                    <th className="py-3 px-4 w-1/4 font-medium">User Requested</th>
                                    <th className="py-3 px-4 w-1/8 font-medium">Status</th>
                                    <th className="py-3 px-4 w-1/8 font-medium">Borrowed</th>
                                    <th className="py-3 px-4 w-1/8 font-medium">Return Date</th>
                                    <th className="py-3 px-4 w-1/8 font-medium">Due Date</th>
                                    <th className="py-3 px-4 w-1/8 font-medium text-center">Receipt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: requestsPerPage }).map((_, i) => (
                                        <tr key={i} className="border-b">
                                            <td className="py-4 px-4"><Skeleton height={60} /></td>
                                            <td className="py-4 px-4"><Skeleton height={40} /></td>
                                            <td className="py-4 px-4"><Skeleton height={24} width={80} /></td>
                                            <td className="py-4 px-4"><Skeleton height={20} width={80} /></td>
                                            <td className="py-4 px-4"><Skeleton height={20} width={80} /></td>
                                            <td className="py-4 px-4"><Skeleton height={20} width={80} /></td>
                                            <td className="py-4 px-4 text-center"><Skeleton height={20} width={60} /></td>
                                        </tr>
                                    ))
                                ) : currentItems.length > 0 ? (
                                    currentItems.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50 transition-all duration-200 border-b"
                                        >
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={item.bookThumbnail}
                                                        alt="Book cover"
                                                        className="w-10 h-14 object-cover rounded shadow flex-shrink-0"
                                                    />
                                                    <span className="font-medium text-gray-800 truncate">{item.bookTitle}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    {item.userAvatar ? (
                                                        <img
                                                            src={item.userAvatar}
                                                            alt="User avatar"
                                                            className="w-8 h-8 rounded-full object-cover shadow flex-shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                            {item.userName ? item.userName[0] : "?"}
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <div className="text-sm font-medium text-gray-700 truncate">{item.userName}</div>
                                                        <div className="text-xs text-gray-500 truncate">{item.userEmail}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span
                                                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${item.status === "Returned"
                                                            ? "text-blue-600 bg-blue-100"
                                                            : item.status === "Late Return"
                                                                ? "text-red-600 bg-red-100"
                                                                : item.status === "Overdue"
                                                                    ? "text-red-600 bg-red-100"
                                                                    : item.status === "Borrowed"
                                                                        ? "text-green-600 bg-green-100"
                                                                        : "text-purple-600 bg-purple-100"
                                                        }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-gray-700">{item.borrowed}</td>
                                            <td className="py-4 px-4 text-gray-700">{item.returnDate}</td>
                                            <td className="py-4 px-4 text-gray-700">{item.dueDate}</td>
                                            <td className="py-4 px-4 text-center">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 transition-colors"
                                                    aria-label="Generate receipt"
                                                >
                                                    <FileText size={16} />
                                                    <span>Generate</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8 text-gray-500">
                                            No results found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {Math.ceil(sorted.length / requestsPerPage) > 1 && (
                        <div className="flex justify-center mt-6 gap-2">
                            {Array.from({ length: Math.ceil(sorted.length / requestsPerPage) }).map(
                                (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPage(index + 1)}
                                        className={`px-4 py-2 border rounded-lg shadow-sm text-sm font-medium transition ${currentPage === index + 1
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "bg-white text-blue-600 border-gray-300 hover:bg-blue-50"
                                            }`}
                                        aria-label={`Go to page ${index + 1}`}
                                    >
                                        {index + 1}
                                    </button>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}