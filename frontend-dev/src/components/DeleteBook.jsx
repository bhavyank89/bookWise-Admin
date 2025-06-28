import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

function DeleteBook({ setBookToDelete, setShowModal, bookToDelete, setBooks }) {
    const [loading, setLoading] = useState(false);

    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    const confirmDeleteBook = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${SERVER_URL}/book/delete/${bookToDelete._id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                toast.error(result.error || "Delete failed");
                throw new Error(result.error || "Delete failed");
            }

            setBooks(prev => prev.filter(b => b._id !== bookToDelete._id));
            toast.success(result.message || "Book deleted!");
        } catch (err) {
            toast.error("Delete failed!");
            console.error(err);
        } finally {
            setLoading(false);
            setShowModal(false);
            setBookToDelete(null);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-4 sm:p-6">
                <h3 id="modal-title" className="text-base sm:text-lg font-semibold mb-4">
                    Confirm Deletion
                </h3>
                <p className="mb-6 text-sm sm:text-base">
                    Are you sure you want to delete the book{" "}
                    <strong>{bookToDelete?.title}</strong>?
                </p>
                <div className="flex justify-end gap-3 sm:gap-4">
                    <button
                        onClick={() => {
                            setShowModal(false);
                            setBookToDelete(null);
                        }}
                        disabled={loading}
                        className="px-3 sm:px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmDeleteBook}
                        disabled={loading}
                        className={`px-3 sm:px-4 py-2 rounded text-sm transition flex items-center gap-2 
                            ${loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}
                        `}
                    >
                        {loading && <Loader2 className="animate-spin w-4 h-4" />}
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteBook;
