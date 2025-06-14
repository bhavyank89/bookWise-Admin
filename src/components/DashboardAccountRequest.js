import React, { useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function DashboardAccountRequest({
    loading,
    accountRequests,
    SkeletonBox,
    setLoading,
    isMounted,
    setAccountRequests,
}) {
    const navigate = useNavigate();

    const generatePlaceholderData = useCallback((user) => {
        const avatar =
            typeof user.avatar === "string"
                ? user.avatar
                : user.avatar?.[0]?.path || null;

        const uniIdDoc =
            typeof user.uniIdDoc === "string"
                ? user.uniIdDoc
                : user.uniIdDoc?.[0]?.path || null;

        return {
            ...user,
            avatar,
            uniIdDoc,
            name: user.name || "Unknown User",
            email: user.email || "example@mail.com",
            uniId: user.uniId || "Unknown UniID",
            createdAt: user.createdAt || new Date().toISOString(),
            isVerified: user.isVerified ?? false,
        };
    }, []);

    const fallbackUsers = useMemo(
        () =>
            [
                {
                    name: "Marc Atenson",
                    email: "marcinnc@gmail.com",
                    avatar: "https://i.imgur.com/7YgWqT4.png",
                },
                {
                    name: "Susan Drake",
                    email: "contact@susandrak.com",
                },
                {
                    name: "Ronald Richards",
                    email: "ronaldrichard@gmail.com",
                },
            ].map(generatePlaceholderData),
        [generatePlaceholderData]
    );

    useEffect(() => {
        isMounted.current = true;

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch("http://localhost:4000/user/fetchall");
                if (!res.ok) throw new Error("Failed to fetch users");

                const data = await res.json();
                if (isMounted.current) {
                    const parsed = data.users.map(generatePlaceholderData);
                    setAccountRequests(parsed);
                }
            } catch (error) {
                console.error("Fetch failed:", error);
                toast.error("Some data failed to load. Using fallback data.");
                if (isMounted.current) {
                    setAccountRequests(fallbackUsers);
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
    }, [generatePlaceholderData, fallbackUsers]);

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <h2 className="font-bold text-lg">Account Requests</h2>
                <button
                    onClick={() => navigate('/account-requests')}
                    className="text-sm bg-[#F8F8FF] px-3 py-1 rounded text-[#25388C] hover:underline"
                >
                    View all
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[320px] overflow-y-auto">
                {loading ? (
                    [...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg w-full transition"
                        >
                            <SkeletonBox height="h-10" width="w-10" />
                            <div className="flex flex-col gap-2 w-full">
                                <SkeletonBox width="w-24" />
                                <SkeletonBox width="w-32" />
                            </div>
                        </div>
                    ))
                ) : accountRequests.length > 0 ? (
                    accountRequests.map((acc, idx) => (
                        <div key={idx} className="relative group w-full">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg hover:shadow-sm transition w-full"
                            >
                                {acc.avatar ? (
                                    <img
                                        src={acc.avatar}
                                        className="w-10 h-10 rounded-full object-cover"
                                        alt={acc.name}
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-[#CBD5E1] flex items-center justify-center font-bold text-white text-sm">
                                        {(acc.name?.[0] || "U").toUpperCase()}
                                    </div>
                                )}
                                <div className="min-w-0 w-full">
                                    <p className="font-medium text-sm truncate">{acc.name}</p>
                                    <p className="text-xs text-[#64748B] truncate">
                                        {acc.email}
                                    </p>
                                </div>
                            </motion.div>
                            <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                requested for – {acc.role || "-"}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-400 col-span-4">
                        No account requests found.
                    </p>
                )}
            </div>
        </>
    );

}

export default DashboardAccountRequest;
