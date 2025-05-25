import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Trash2 } from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const BookDetails = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [bookData, setBookData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchBookData = async () => {
            try {
                const res = await fetch(`http://localhost:4000/book/fetch/${bookId}`);
                if (!res.ok) throw new Error('Failed to fetch book data');
                const data = await res.json();
                setBookData(data.book);
            } catch (error) {
                toast.error('Error fetching book data.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchBookData();
    }, [bookId]);

    const toggleEdit = () => navigate(`/update/${bookId}`);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleViewPDF = () => {
        if (bookData?.pdfCloudinary?.secure_url) window.open(bookData.pdfCloudinary.secure_url, '_blank', 'noopener,noreferrer');
        else toast.warning('No PDF available for this book.');
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`http://localhost:4000/book/delete/${bookId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete book');
            toast.success('Book deleted successfully!');
            navigate('/');
        } catch (error) {
            toast.error('Failed to delete book.');
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 animate-pulse">
                <div className="h-6 bg-gray-300 w-1/4 mb-4 rounded" />
                <div className="h-10 w-32 bg-gray-300 rounded mb-6" />
                <div className="flex space-x-6">
                    <div className="w-40 h-60 bg-gray-300 rounded-lg" />
                    <div className="flex-1 space-y-4">
                        <div className="h-6 bg-gray-300 rounded w-1/2" />
                        <div className="h-4 bg-gray-300 rounded w-1/4" />
                        <div className="h-24 bg-gray-300 rounded" />
                        <div className="h-10 w-32 bg-gray-300 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (!bookData) {
        return <div className="container mx-auto p-4 text-center text-gray-500">No book data available.</div>;
    }

    return (
        <motion.div className="container mx-auto p-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="mb-6">
                <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="font-bold text-2xl">
                    Book Details
                </motion.h1>
                <p className="text-sm text-muted-foreground">Monitor and manage book metadata.</p>
            </div>

            <div className="mb-4">
                <button onClick={handleGoBack} className="text-sm flex items-center gap-2 mb-5 p-2 rounded-md shadow-sm hover:shadow-md transition bg-white text-[#25388C] hover:underline ">
                    <ArrowLeft size={18} /> Go back
                </button>
            </div>

            <div className="flex flex-col md:flex-row space-y-6 md:space-x-6 md:space-y-0">
                <motion.div className="w-40 h-60 bg-gray-200 rounded-lg overflow-hidden shadow-md" whileHover={{ scale: 1.05 }}>
                    <img
                        src={bookData.thumbnailCloudinary?.secure_url || bookData.thumbnail}
                        alt={bookData.title}
                        title="Book Thumbnail Preview"
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                <div className="flex-1">
                    <div className="mb-4 space-y-1">
                        <h3 className="text-xl font-semibold">{bookData.title}</h3>
                        <p className="text-sm text-gray-500">By {bookData.author}</p>
                        <p className="text-sm text-gray-500">Created at: {new Date(bookData.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4">
                        <motion.button whileTap={{ scale: 0.95 }} onClick={toggleEdit} className="bg-[#25388C] text-white font-medium py-2 px-6 rounded-lg shadow hover:bg-[#1d2d70] transition ">
                            Edit Book
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.95 }} onClick={handleViewPDF} className="bg-green-600 text-white font-medium py-2 px-6 rounded-lg shadow hover:bg-green-700 transition flex items-center gap-2 ">
                            <FileText size={18} /> View PDF
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowDeleteModal(true)} className="bg-red-600 text-white font-medium py-2 px-6 rounded-lg shadow hover:bg-red-700 transition flex items-center gap-2 ">
                            <Trash2 size={18} /> Delete
                        </motion.button>
                    </div>
                </div>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg shadow-sm bg-white">
                    <p className="font-medium text-lg mb-2">Summary</p>
                    <p className="text-sm text-gray-700">{bookData.summary}</p>
                </div>

                <div className="p-4 border rounded-lg shadow-sm bg-white">
                    <p className="font-medium text-lg mb-2">Video</p>
                    {bookData.videoCloudinary?.secure_url ? (
                        <video src={bookData.videoCloudinary.secure_url} controls className="w-full h-56 object-cover rounded-lg" />
                    ) : (
                        <div className="w-full h-56 bg-gray-100 rounded-lg flex justify-center items-center">
                            <span className="text-gray-500">No video available.</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
                        <h2 className="text-lg font-semibold mb-2">Are you sure?</h2>
                        <p className="text-sm text-gray-600 mb-4">This action will permanently delete the book <span className='font-bold text-black'>{bookData.title}</span>. This cannot be undone.</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md "
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md "
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default BookDetails;
