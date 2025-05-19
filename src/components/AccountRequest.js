import { useEffect, useState } from "react";
import { Eye, ChevronDown, X, Check } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tooltip from "@radix-ui/react-tooltip";
import toast, { Toaster } from "react-hot-toast";

export default function AccountRequests() {
    const [search, setSearch] = useState("");
    const [sortAsc, setSortAsc] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [modalInfo, setModalInfo] = useState(null);

    const requestsPerPage = 6;

    const generatePlaceholderData = (user) => ({
        ...user,
        avatar: user.avatar?.[0]?.path || null,
        uniIdDoc: user.uniIdDoc?.[0]?.path || null,
        name: user.name || "Unknown User",
        email: user.email || "example@mail.com",
        uniId: user.uniId || "Unknown UniID",
        createdAt: user.createdAt || new Date().toISOString(),
        isVerified: user.isVerified !== undefined ? user.isVerified : false,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:4000/fetchall");
                const result = await response.json();
                const usersWithPlaceholders = result.users.map(generatePlaceholderData);
                setData(usersWithPlaceholders);
            } catch (err) {
                toast.error("Failed to fetch users.");
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        setTimeout(fetchData, 1000);
    }, []);

    const filtered = data.filter((item) => {
        const term = search.toLowerCase();
        return (
            item.name.toLowerCase().includes(term) ||
            item.email.toLowerCase().includes(term) ||
            item.uniId.includes(term)
        );
    });

    const sorted = [...filtered].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortAsc ? dateA - dateB : dateB - dateA;
    });

    const indexOfLast = currentPage * requestsPerPage;
    const currentItems = sorted.slice(indexOfLast - requestsPerPage, indexOfLast);

    const handleAction = async (actionType, id, item) => {
        const url =
            actionType === "verify"
                ? "http://localhost:4000/verifyuser/verify"
                : "http://localhost:4000/verifyuser/deverify";

        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                setData((prevData) =>
                    prevData.map((user) =>
                        user._id === id ? { ...user, isVerified: actionType === "verify" } : user
                    )
                );
                toast.success(
                    actionType === "verify"
                        ? "User verified successfully!"
                        : "User deverified."
                );
            } else {
                throw new Error("Failed to update user.");
            }
        } catch (error) {
            toast.error("Server error. Please try again.");
            console.error(error);
        }
    };

    return (
        <div className="p-6 bg-[#f5f7fd] min-h-screen">
            <Toaster position="top-right" />
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-semibold mb-1">Welcome, Adrian</h1>
                <p className="text-sm text-gray-500 mb-6">
                    Monitor all of your projects and tasks here
                </p>

                <div className="flex items-center justify-between mb-4">
                    <input
                        type="text"
                        placeholder="Search users by name, email, or university ID."
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
                                    <th className="py-2 w-1/5 text-center">Actions</th>
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
                                                key={item._id}
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
                                                <td>{new Date(item.createdAt).toDateString()}</td>
                                                <td>{item.uniId}</td>
                                                <td>
                                                    <Tooltip.Root>
                                                        <Tooltip.Trigger asChild>
                                                            <a
                                                                href={item.uniIdDoc}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 flex items-center gap-1 hover:underline"
                                                            >
                                                                <Eye size={16} />
                                                                View ID Card
                                                            </a>
                                                        </Tooltip.Trigger>
                                                        <Tooltip.Content className="bg-white border shadow-lg p-2 rounded">
                                                            {item.uniIdDoc ? (
                                                                <img
                                                                    src={item.uniIdDoc}
                                                                    alt="University ID"
                                                                    className="w-48 h-auto"
                                                                />
                                                            ) : (
                                                                <span>No ID Uploaded</span>
                                                            )}
                                                        </Tooltip.Content>
                                                    </Tooltip.Root>
                                                </td>
                                                <td className="flex justify-center gap-2">
                                                    <Dialog.Root>
                                                        <Dialog.Trigger asChild>
                                                            <button
                                                                className={`text-xs px-3 py-1 rounded flex items-center gap-1 ${item.isVerified
                                                                        ? "bg-red-100 text-red-700"
                                                                        : "bg-green-100 text-green-700"
                                                                    }`}
                                                            >
                                                                {item.isVerified ? (
                                                                    <>
                                                                        <X size={14} />
                                                                        DeVerify
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Check size={14} />
                                                                        Verify
                                                                    </>
                                                                )}
                                                            </button>
                                                        </Dialog.Trigger>
                                                        <Dialog.Portal>
                                                            <Dialog.Overlay className="fixed inset-0 bg-black/40" />
                                                            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-xl max-w-sm w-full">
                                                                <Dialog.Title className="text-lg font-semibold mb-2">
                                                                    Confirm Action
                                                                </Dialog.Title>
                                                                <Dialog.Description className="text-sm text-gray-500 mb-4">
                                                                    Are you sure you want to{" "}
                                                                    <strong>
                                                                        {item.isVerified ? "deverify" : "verify"}
                                                                    </strong>{" "}
                                                                    this account?
                                                                </Dialog.Description>
                                                                <div className="flex justify-end gap-2">
                                                                    <Dialog.Close asChild>
                                                                        <button className="px-4 py-2 border rounded">
                                                                            Cancel
                                                                        </button>
                                                                    </Dialog.Close>
                                                                    <Dialog.Close asChild>
                                                                        <button
                                                                            onClick={() =>
                                                                                handleAction(
                                                                                    item.isVerified
                                                                                        ? "deverify"
                                                                                        : "verify",
                                                                                    item._id,
                                                                                    item
                                                                                )
                                                                            }
                                                                            className="px-4 py-2 bg-blue-600 text-white rounded"
                                                                        >
                                                                            Confirm
                                                                        </button>
                                                                    </Dialog.Close>
                                                                </div>
                                                            </Dialog.Content>
                                                        </Dialog.Portal>
                                                    </Dialog.Root>
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

                    <div className="flex justify-center mt-4 gap-2">
                        {Array.from({ length: Math.ceil(sorted.length / requestsPerPage) }).map(
                            (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={`px-4 py-2 border rounded transition-all duration-200 ${currentPage === index + 1
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-blue-600 hover:bg-blue-100"
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
