import { X, Printer } from "lucide-react";

const PrintModal = ({ onClose, borrowData }) => {
    const handlePrintReceipt = () => {
        const printContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Library Borrow Receipt</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f9fafb;
                    padding: 2rem;
                    color: #111827;
                    max-width: 700px;
                    margin: auto;
                }
                .header {
                    text-align: center;
                    border-bottom: 2px solid #d1d5db;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                }
                .header h2 {
                    margin: 0;
                    font-size: 1.75rem;
                    color: #1f2937;
                }
                .section {
                    margin-bottom: 1.5rem;
                }
                .section h4 {
                    margin-bottom: 0.5rem;
                    color: #4b5563;
                    font-size: 1.125rem;
                    border-bottom: 1px solid #e5e7eb;
                    padding-bottom: 0.25rem;
                }
                .row {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.5rem 0;
                    border-bottom: 1px dashed #e5e7eb;
                }
                .label {
                    font-weight: 600;
                    color: #374151;
                }
                .value {
                    color: #6b7280;
                }
                .status {
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-weight: bold;
                    font-size: 0.875rem;
                }
                .status-returned { background: #dbeafe; color: #2563eb; }
                .status-late, .status-overdue { background: #fee2e2; color: #dc2626; }
                .status-borrowed { background: #dcfce7; color: #16a34a; }
                .status-requested { background: #f3e8ff; color: #9333ea; }
                .footer {
                    text-align: center;
                    margin-top: 3rem;
                    font-size: 0.875rem;
                    color: #6b7280;
                    border-top: 1px solid #e5e7eb;
                    padding-top: 1rem;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>Library Borrow Receipt</h2>
            </div>

            <div class="section">
                <h4>Book Information</h4>
                <div class="row"><span class="label">Title:</span><span class="value">${borrowData.bookTitle || 'N/A'}</span></div>
                <div class="row"><span class="label">Author:</span><span class="value">${borrowData.bookAuthor || 'N/A'}</span></div>
                <div class="row"><span class="label">Book ID:</span><span class="value">${borrowData.bookId || 'N/A'}</span></div>
            </div>

            <div class="section">
                <h4>User Information</h4>
                <div class="row"><span class="label">Name:</span><span class="value">${borrowData.userName || 'N/A'}</span></div>
                <div class="row"><span class="label">Email:</span><span class="value">${borrowData.userEmail || 'N/A'}</span></div>
                <div class="row"><span class="label">University ID:</span><span class="value">${borrowData.uniId || 'N/A'}</span></div>
            </div>

            <div class="section">
                <h4>Borrow Details</h4>
                <div class="row"><span class="label">Status:</span>
                    <span class="value">
                        <span class="status status-${borrowData.status?.toLowerCase().replace(/\s+/g, '-')}">${borrowData.status || 'N/A'}</span>
                    </span>
                </div>
                <div class="row"><span class="label">Requested Date:</span><span class="value">${borrowData.requested || 'N/A'}</span></div>
                <div class="row"><span class="label">Borrowed Date:</span><span class="value">${borrowData.borrowed || 'N/A'}</span></div>
                <div class="row"><span class="label">Due Date:</span><span class="value">${borrowData.dueDate || 'N/A'}</span></div>
                <div class="row"><span class="label">Return Date:</span><span class="value">${borrowData.returned || 'N/A'}</span></div>
                <div class="row"><span class="label">Late Fine:</span><span class="value">${borrowData.lateFine > 0 ? `₹${borrowData.lateFine}` : 'No Fine'}</span></div>
            </div>

            <div class="footer">
                <p>Generated on ${new Date().toLocaleString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}</p>
                <p>Library Management System</p>
            </div>
        </body>
        </html>
    `;

        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.onload = () => {
                printWindow.print();
                printWindow.onafterprint = () => printWindow.close();
            };
        } else {
            alert('Please allow popups to print the receipt');
        }
    };

    if (!borrowData) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal content */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh]">
                {/* Scrollable Inner Container */}
                <div className="overflow-y-auto max-h-[75vh] pr-1">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-800">Borrow History Details</h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={24} className="text-gray-600" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Book Information */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            {borrowData?.bookThumbnail ? (
                                <img
                                    src={borrowData.bookThumbnail}
                                    alt="Book cover"
                                    className="w-16 h-24 object-cover rounded shadow"
                                />
                            ) : (
                                <div className="w-16 h-24 bg-blue-100 text-blue-700 rounded shadow flex items-center justify-center font-bold text-2xl">
                                    {borrowData.bookTitle?.[0]?.toUpperCase() || 'B'}
                                </div>
                            )}
                            <div>
                                <h4 className="font-semibold text-lg text-gray-800">{borrowData.bookTitle}</h4>
                                <p className="text-gray-600">Author: {borrowData.bookAuthor || 'N/A'}</p>
                                <p className="text-gray-600">Book ID: {borrowData.bookId}</p>
                            </div>
                        </div>

                        {/* User Information */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            {borrowData.userAvatar ? (
                                <img
                                    src={borrowData.userAvatar[0].path}
                                    alt="User avatar"
                                    className="w-12 h-12 rounded-full object-cover shadow"
                                />
                            ) : (
                                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                                    {borrowData.userName ? borrowData.userName[0] : "?"}
                                </div>
                            )}
                            <div>
                                <h4 className="font-semibold text-lg text-gray-800">{borrowData.userName}</h4>
                                <p className="text-gray-600">{borrowData.userEmail}</p>
                                <p className="text-gray-500 text-sm">{borrowData.uniId}</p>
                            </div>
                        </div>

                        {/* Borrow Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h5 className="font-medium text-gray-700 mb-2">Status</h5>
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${borrowData.status === "Returned"
                                        ? "text-blue-600 bg-blue-100"
                                        : borrowData.status === "Late Return" || borrowData.status === "Overdue"
                                            ? "text-red-600 bg-red-100"
                                            : borrowData.status === "Borrowed"
                                                ? "text-green-600 bg-green-100"
                                                : "text-purple-600 bg-purple-100"
                                        }`}
                                >
                                    {borrowData.status}
                                </span>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h5 className="font-medium text-gray-700 mb-2">Late Fine</h5>
                                <p className="text-lg font-semibold text-gray-800">
                                    {borrowData.lateFine > 0 ? `₹${borrowData.lateFine}` : "No Fine"}
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h5 className="font-medium text-gray-700 mb-2">Requested Date</h5>
                                <p className="text-gray-800">{borrowData.requested}</p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h5 className="font-medium text-gray-700 mb-2">Borrowed Date</h5>
                                <p className="text-gray-800">{borrowData.borrowed}</p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h5 className="font-medium text-gray-700 mb-2">Due Date</h5>
                                <p className="text-gray-800">{borrowData.dueDate}</p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h5 className="font-medium text-gray-700 mb-2">Return Date</h5>
                                <p className="text-gray-800">{borrowData.returned}</p>
                            </div>
                        </div>
                    </div>

                    {/* Print Button */}
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handlePrintReceipt}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                        >
                            <Printer size={20} />
                            Print Receipt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrintModal;
