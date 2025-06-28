function BorrowHistoryTable({
    loading,
    currentItems,
    requestsPerPage,
    handleGenerateDetails,
    Skeleton,
    activeUser
}) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
                Borrow History Records
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left table-fixed min-w-[1000px]">
                    <thead>
                        <tr className="text-gray-600 bg-gray-50">
                            <th className="py-3 mr-2 px-4 w-[20%] font-medium">Book</th>
                            <th className="py-3 px-4 w-[20%] font-medium">User</th>
                            <th className="py-3 px-4 w-[10%] font-medium">Status</th>
                            <th className="py-3 px-4 w-[10%] font-medium">Requested</th>
                            <th className="py-3 px-4 w-[10%] font-medium">Borrowed</th>
                            <th className="py-3 px-4 w-[10%] font-medium">Due On</th>
                            <th className="py-3 px-4 w-[10%] font-medium">Returned</th>
                            <th className="py-3 px-4 w-[10%] font-medium">Late Fine</th>
                            <th className="py-3 px-4 w-[10%] font-medium text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: requestsPerPage }).map((_, i) => (
                                <tr key={i} className="border-b">
                                    {Array.from({ length: 9 }).map((_, j) => (
                                        <td key={j} className="py-4 px-4">
                                            <Skeleton height={20} />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : currentItems.length > 0 ? (
                            currentItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-all duration-200 border-b">
                                    {/* Book Column */}
                                    <td className="py-4 mr-2 px-4 pr-6">
                                        <div className="flex items-center gap-4 min-w-0">
                                            {item?.bookThumbnail || item?.thumbnailURL ? (
                                                <img
                                                    src={item.bookThumbnail || item.thumbnailURL}
                                                    alt="Book cover"
                                                    className="w-10 h-14 object-cover rounded shadow flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-10 h-14 bg-blue-100 text-blue-700 rounded shadow flex items-center justify-center font-bold text-xl flex-shrink-0">
                                                    {item.bookTitle?.[0]?.toUpperCase() || 'B'}
                                                </div>
                                            )}
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-medium text-gray-800 truncate w-[150px]">
                                                    {item.bookTitle}
                                                </span>
                                                <span className="text-sm text-gray-500 truncate w-[150px]">
                                                    {item.bookAuthor || 'Unknown Author'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* User Column */}
                                    <td className="py-4 px-4 pl-6">
                                        <div className="flex items-center gap-4 min-w-0">
                                            {item.userAvatar ? (
                                                <img
                                                    src={item.userAvatar[0].path}
                                                    alt="User avatar"
                                                    className="w-8 h-8 rounded-full object-cover shadow flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                    {item.userName ? item.userName[0] : "?"}
                                                </div>
                                            )}
                                            <div className="flex flex-col min-w-0">
                                                <div className="text-sm font-medium text-gray-700 truncate w-[150px]">
                                                    {item.userName}
                                                </div>
                                                <div className="text-xs text-gray-500 truncate w-[150px]">
                                                    {item.userEmail}
                                                </div>
                                                <div className="text-xs text-gray-400 truncate w-[150px]">
                                                    {item.uniId}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Other Columns */}
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
                                    <td className="py-4 px-4 text-gray-700">{item.returned}</td>
                                    <td className="py-4 px-4 text-gray-700">
                                        {item.lateFine > 0 ? `₹${item.lateFine}` : "-"}
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <button
                                            disabled={!activeUser.isVerified}
                                            onClick={() => handleGenerateDetails(item)}
                                            className="px-3 py-1 rounded text-xs font-medium transition text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                            aria-label="Generate details"
                                        >
                                            Generate
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="text-center py-8 text-gray-500">
                                    No borrow history found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BorrowHistoryTable;
