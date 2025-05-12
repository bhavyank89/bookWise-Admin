import { useEffect, useState } from "react";
import { FileText, ChevronDown } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const mockData = [
    {
        id: 1,
        book: "The Great Reclamation...",
        user: "Darrell Steward",
        email: "steward@gmail.com",
        status: "Borrowed",
        borrowed: "Dec 19 2023",
        returnDate: "Dec 29 2023",
        dueDate: "Dec 31 2023",
        image: "https://via.placeholder.com/40x60?text=Book1",
        avatar: "https://i.pravatar.cc/40?u=darrell"
    },
    {
        id: 2,
        book: "Inside Evil: Inside Evil...",
        user: "Marc Atenson",
        email: "marcinee@mial.com",
        status: "Late Return",
        borrowed: "Dec 21 2024",
        returnDate: "Jan 17 2024",
        dueDate: "Jan 12 2024",
        image: "https://via.placeholder.com/40x60?text=Book2",
        avatar: "https://i.pravatar.cc/40?u=marc"
    },
    {
        id: 3,
        book: "Jayne Castle - People...",
        user: "Susan Drake",
        email: "contact@susandrake.io",
        status: "Returned",
        borrowed: "Dec 31 2023",
        returnDate: "Jan 15 2023",
        dueDate: "Jan 25 2023",
        image: "https://via.placeholder.com/40x60?text=Book3",
        avatar: ""
    },
    {
        id: 4,
        book: "The Great Reclamation...",
        user: "David Smith",
        email: "davide@yahoo.com",
        status: "Borrowed",
        borrowed: "Dec 19 2023",
        returnDate: "Dec 29 2023",
        dueDate: "Dec 31 2023",
        image: "https://via.placeholder.com/40x60?text=Book1",
        avatar: "https://i.pravatar.cc/40?u=david"
    }
];

export default function BorrowRequests() {
    const [search, setSearch] = useState("");
    const [sortAsc, setSortAsc] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const requestsPerPage = 2;

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setData(mockData);
            setLoading(false);
        }, 1000);
    }, []);

    const filtered = data.filter((item) => {
        const term = search.toLowerCase();
        return (
            item.book.toLowerCase().includes(term) ||
            item.user.toLowerCase().includes(term) ||
            item.email.toLowerCase().includes(term)
        );
    });

    const sorted = [...filtered].sort((a, b) => {
        const dateA = new Date(a.borrowed);
        const dateB = new Date(b.borrowed);
        return sortAsc ? dateA - dateB : dateB - dateA;
    });

    const indexOfLast = currentPage * requestsPerPage;
    const currentItems = sorted.slice(indexOfLast - requestsPerPage, indexOfLast);

    return (
        <div className="p-6 bg-[#f5f7fd] min-h-screen">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-semibold mb-1">Welcome, Adrian</h1>
                <p className="text-sm text-gray-500 mb-6">
                    Monitor all of your projects and tasks here
                </p>

                <div className="flex items-center justify-between mb-4">
                    <input
                        type="text"
                        placeholder="Search users, books by title, author, or genre."
                        className="w-1/2 px-4 py-2 border rounded shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        onClick={() => setSortAsc(!sortAsc)}
                        className="flex items-center gap-1 border px-4 py-2 rounded shadow-sm"
                    >
                        {sortAsc ? "Oldest to Recent" : "Recent to Oldest"}
                        <ChevronDown size={16} />
                    </button>
                </div>

                <div className="bg-white rounded shadow p-4">
                    <h2 className="text-lg font-bold mb-4">Borrow Book Requests</h2>

                    {/* Horizontal Scroll Container */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="text-gray-600 bg-[#F8F8FF]">
                                    <th className="py-2 pl-2 w-1/5">Book</th>
                                    <th className="py-2 w-1/5">User Requested</th>
                                    <th className="py-2 w-1/5">Status</th>
                                    <th className="py-2 w-1/5">Borrowed</th>
                                    <th className="py-2 w-1/5">Return date</th>
                                    <th className="py-2 w-1/5">Due Date</th>
                                    <th className="py-2 w-1/5">Receipt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading
                                    ? Array.from({ length: requestsPerPage }).map((_, i) => (
                                        <tr key={i}>
                                            <td><Skeleton height={60} /></td>
                                            <td><Skeleton width={100} /></td>
                                            <td><Skeleton width={80} /></td>
                                            <td><Skeleton width={80} /></td>
                                            <td><Skeleton width={80} /></td>
                                            <td><Skeleton width={80} /></td>
                                            <td><Skeleton width={60} /></td>
                                        </tr>
                                    ))
                                    : currentItems.length > 0 ? (
                                        currentItems.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-gray-50 transition-all duration-300"
                                            >
                                                <td className="py-2 pl-2 flex items-center gap-2 w-1/5">
                                                    <img
                                                        src={item.image}
                                                        alt="cover"
                                                        className="w-10 h-14 object-cover rounded"
                                                    />
                                                    <span>{item.book}</span>
                                                </td>
                                                <td className="flex items-center gap-2 w-1/5">
                                                    {item.avatar ? (
                                                        <img
                                                            src={item.avatar}
                                                            alt="avatar"
                                                            className="w-8 h-8 rounded-full"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                                                            {item.user[0]}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div>{item.user}</div>
                                                        <div className="text-xs text-gray-500">{item.email}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs font-medium ${item.status === "Returned"
                                                            ? "text-blue-600 bg-blue-100"
                                                            : item.status === "Late Return"
                                                                ? "text-red-600 bg-red-100"
                                                                : "text-purple-600 bg-purple-100"
                                                            }`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td>{item.borrowed}</td>
                                                <td>{item.returnDate}</td>
                                                <td>{item.dueDate}</td>
                                                <td>
                                                    <button className="text-blue-600 flex items-center gap-1 hover:underline">
                                                        <FileText size={16} />
                                                        Generate
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-4 text-gray-500">
                                                No results found
                                            </td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-4 gap-2">
                        {Array.from({ length: Math.ceil(sorted.length / requestsPerPage) }).map(
                            (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={`px-4 py-2 border rounded ${currentPage === index + 1
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-blue-600"
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
