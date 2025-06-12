import React, { useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast"; // ✅ Missing import fixed

function DashboardAccountRequest({
    loading,
    accountRequests,
    SkeletonBox,
    setLoading,
    isMounted,
    setAccountRequests,
}) {
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
                const res = await fetch("http://localhost:4000/fetchall");
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
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Account Requests</h2>
                <a
                    href="#"
                    className="text-sm bg-[#F8F8FF] p-2 rounded-sm text-[#25388C] hover:underline"
                >
                    View all
                </a>
            </div>

            <div className="flex flex-row gap-4 overflow-y-auto overflow-x-auto no-scrollbar max-h-[320px]">
                {loading ? (
                    [...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg"
                        >
                            <SkeletonBox height="h-10" width="w-10" />
                            <div className="flex flex-col gap-2">
                                <SkeletonBox width="w-24" />
                                <SkeletonBox width="w-32" />
                            </div>
                        </div>
                    ))
                ) : accountRequests.length > 0 ? (
                    accountRequests.map((acc, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg hover:shadow-sm transition"
                        >
                            {acc.avatar ? (
                                <img
                                    src={acc.avatar}
                                    className="w-10 h-10 rounded-full"
                                    alt={acc.name}
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-[#CBD5E1] flex items-center justify-center font-bold text-white text-sm">
                                    {(acc.name?.[0] || "U").toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="font-medium text-sm">{acc.name}</p>
                                <p className="text-xs text-[#64748B] truncate w-[140px]">
                                    {acc.email}
                                </p>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <p className="text-sm text-gray-400 col-span-3">
                        No account requests found.
                    </p>
                )}
            </div>
        </>
    );

}

export default DashboardAccountRequest;
