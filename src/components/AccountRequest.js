import { useEffect, useState } from "react";
import { Eye, ChevronDown, X, Check } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const mockAccounts = [
    {
        id: 1,
        name: "Darrell Steward",
        email: "darrellsteward@gmail.com",
        joined: "Dec 18 2023", // Changed
        universityId: "90324423789",
        avatar: "https://i.pravatar.cc/40?u=darrell"
    },
    {
        id: 2,
        name: "Marc Atenson",
        email: "marcine@mial.com",
        joined: "Jan 05 2024", // Changed
        universityId: "45641243423",
        avatar: "https://i.pravatar.cc/40?u=marc"
    },
    {
        id: 3,
        name: "Susan Drake",
        email: "contact@susandrake.io",
        joined: "Nov 25 2023", // Changed
        universityId: "78318342289",
        avatar: ""
    }
];


export default function AccountRequests() {
    const [search, setSearch] = useState("");
    const [sortAsc, setSortAsc] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const requestsPerPage = 2;

    useEffect(() => {
        setTimeout(() => {
            setData(mockAccounts);
            setLoading(false);
        }, 1000);
    }, []);

    const filtered = data.filter((item) => {
        const term = search.toLowerCase();
        return (
            item.name.toLowerCase().includes(term) ||
            item.email.toLowerCase().includes(term) ||
            item.universityId.includes(term)
        );
    });

    const sorted = [...filtered].sort((a, b) => {
        const dateA = new Date(a.joined);
        const dateB = new Date(b.joined);
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
                        <ChevronDown
                            size={16}
                            className={`${sortAsc ? "rotate-180" : ""} transition-transform`}
                        />
                    </button>

                </div>

                <div className="bg-white rounded shadow p-4">
                    <h2 className="text-lg font-bold mb-4">Account Registration Requests</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="text-gray-600 bg-[#F8F8FF]">
                                    <th className="py-2 pl-2 w-1/4">Name</th>
                                    <th className="py-2 w-1/6">Date Joined</th>
                                    <th className="py-2 w-1/5">University ID No</th>
                                    <th className="py-2 w-1/5">University ID Card</th>
                                    <th className="py-2 w-1/5">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading
                                    ? Array.from({ length: requestsPerPage }).map((_, i) => (
                                        <tr key={i}>
                                            <td><Skeleton height={40} /></td>
                                            <td><Skeleton width={80} /></td>
                                            <td><Skeleton width={100} /></td>
                                            <td><Skeleton width={100} /></td>
                                            <td><Skeleton width={120} /></td>
                                        </tr>
                                    ))
                                    : currentItems.length > 0 ? (
                                        currentItems.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-gray-50 transition-all duration-300"
                                            >
                                                <td className="py-2 pl-2 flex items-center gap-3">
                                                    {item.avatar ? (
                                                        <img
                                                            src={item.avatar}
                                                            alt="avatar"
                                                            className="w-8 h-8 rounded-full"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                                                            {item.name[0]}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium">{item.name}</div>
                                                        <div className="text-xs text-gray-500">{item.email}</div>
                                                    </div>
                                                </td>
                                                <td>{item.joined}</td>
                                                <td>{item.universityId}</td>
                                                <td>
                                                    <button className="text-blue-600 flex items-center gap-1 hover:underline">
                                                        <Eye size={16} />
                                                        View ID Card
                                                    </button>
                                                </td>
                                                <td className="flex gap-2 ">
                                                    <button className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded flex items-center gap-1">
                                                        <Check size={14} />
                                                        Approve Account
                                                    </button>
                                                    <button className="rounded-full border border-red-600 text-red-600 hover:text-red-800 hover:border-red-800 p-1">
                                                        <X size={14} />
                                                    </button>

                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4 text-gray-500">
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
