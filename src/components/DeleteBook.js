import React from 'react'

function DeleteBook({ setBookToDelete, setShowModal, bookToDelete, setBooks }) {
    const confirmDeleteBook = async () => {
        try {
            const response = await fetch(`http://localhost:4000/book/delete/${bookToDelete._id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) throw new Error("Delete failed");
            const result = await response.json();
            setBooks((prev) => prev.filter((b) => b._id !== bookToDelete._id));
            toast.success(result.message || "Book deleted!");
        } catch (err) {
            toast.error("Delete failed!");
            console.error(err);
        } finally {
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
                        className="px-3 sm:px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmDeleteBook}
                        className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteBook
