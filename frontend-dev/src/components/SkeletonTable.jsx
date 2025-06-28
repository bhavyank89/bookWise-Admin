function SkeletonTable() {
    // Simple skeleton placeholders for loading state
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left min-w-[600px] sm:min-w-[700px]">
                <thead>
                    <tr className="bg-gray-100">
                        {Array(5)
                            .fill(0)
                            .map((_, i) => (
                                <th key={i} className="p-2 sm:p-4">
                                    <div className="h-3 sm:h-4 bg-gray-300 rounded animate-pulse"></div>
                                </th>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    {Array(5)
                        .fill(0)
                        .map((_, i) => (
                            <tr key={i} className="border-b border-gray-200">
                                {Array(5)
                                    .fill(0)
                                    .map((_, j) => (
                                        <td key={j} className="p-2 sm:p-4">
                                            <div className="h-3 sm:h-4 bg-gray-300 rounded animate-pulse"></div>
                                        </td>
                                    ))}
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default SkeletonTable
