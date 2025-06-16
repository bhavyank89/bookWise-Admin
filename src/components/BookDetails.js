import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Trash2, Edit3, Calendar, User, BookOpen } from 'lucide-react';
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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
                <div className="container mx-auto px-6 py-8">
                    <div className="animate-pulse space-y-8">
                        {/* Header skeleton */}
                        <div className="space-y-3">
                            <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl w-1/3" />
                            <div className="h-4 bg-slate-200 rounded-lg w-1/2" />
                        </div>
                        
                        {/* Back button skeleton */}
                        <div className="h-10 w-24 bg-slate-200 rounded-lg" />
                        
                        {/* Main content skeleton */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1">
                                <div className="aspect-[3/4] bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl" />
                            </div>
                            <div className="lg:col-span-2 space-y-6">
                                <div className="space-y-4">
                                    <div className="h-8 bg-slate-200 rounded-lg w-3/4" />
                                    <div className="h-5 bg-slate-200 rounded-lg w-1/3" />
                                    <div className="h-5 bg-slate-200 rounded-lg w-1/2" />
                                </div>
                                <div className="flex gap-3">
                                    <div className="h-12 w-32 bg-slate-200 rounded-xl" />
                                    <div className="h-12 w-32 bg-slate-200 rounded-xl" />
                                    <div className="h-12 w-24 bg-slate-200 rounded-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!bookData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
                <div className="text-center p-8">
                    <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-700 mb-2">No Book Found</h2>
                    <p className="text-slate-500">The requested book data is not available.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <motion.div 
                className="container mx-auto px-6 py-8" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {/* Modern Header */}
                <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                        Book Details
                    </h1>
                    <p className="text-slate-600 text-lg">Explore and manage your book collection</p>
                </motion.div>

                {/* Modern Back Button */}
                <motion.button 
                    onClick={handleGoBack} 
                    className="group flex items-center gap-2 mb-8 px-4 py-2 rounded-xl bg-white/70 backdrop-blur-sm border border-slate-200/50 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300"
                    whileHover={{ x: -4 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-slate-800 transition-colors" />
                    <span className="text-slate-600 group-hover:text-slate-800 font-medium transition-colors">Go back</span>
                </motion.button>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Book Cover */}
                    <motion.div 
                        className="lg:col-span-1"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <motion.div 
                            className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/20 bg-gradient-to-br from-slate-100 to-slate-200"
                            whileHover={{ scale: 1.02, rotateY: 5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img
                                src={bookData.thumbnailCloudinary?.secure_url || bookData.thumbnail}
                                alt={bookData.title}
                                title="Book Thumbnail Preview"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </motion.div>

                    {/* Book Info */}
                    <motion.div 
                        className="lg:col-span-2 space-y-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {/* Title and Meta */}
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-slate-800 leading-tight">{bookData.title}</h2>
                            
                            <div className="flex flex-wrap gap-4 text-slate-600">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span className="font-medium">By {bookData.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Created {new Date(bookData.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                            <motion.button 
                                onClick={toggleEdit}
                                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-300"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                Edit Book
                            </motion.button>

                            {["ebook", "both"].includes(bookData?.bookType?.toLowerCase()) && (
                                <motion.button
                                    onClick={handleViewPDF}
                                    className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 transition-all duration-300"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    View PDF
                                </motion.button>
                            )}

                            <motion.button 
                                onClick={() => setShowDeleteModal(true)}
                                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Delete
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* Content Cards */}
                <motion.div 
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    {/* Summary Card */}
                    <motion.div 
                        className="group p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/30 transition-all duration-300"
                        whileHover={{ y: -4 }}
                    >
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                            Summary
                        </h3>
                        <p className="text-slate-700 leading-relaxed">{bookData.summary}</p>
                    </motion.div>

                    {/* Video Card */}
                    <motion.div 
                        className="group p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/30 transition-all duration-300"
                        whileHover={{ y: -4 }}
                    >
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                            Preview Video
                        </h3>
                        
                        {bookData.videoCloudinary?.secure_url ? (
                            <div className="rounded-xl overflow-hidden shadow-lg">
                                <video 
                                    src={bookData.videoCloudinary.secure_url} 
                                    controls 
                                    className="w-full h-56 object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-56 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                                <div className="text-center">
                                    <FileText className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                                    <span className="text-slate-500 font-medium">No video available</span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>

                {/* Modern Delete Modal */}
                {showDeleteModal && (
                    <motion.div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-slate-200"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.3 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <Trash2 className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Delete Book</h2>
                                    <p className="text-slate-600 text-sm">This action cannot be undone</p>
                                </div>
                            </div>
                            
                            <p className="text-slate-700 mb-6">
                                Are you sure you want to permanently delete 
                                <span className="font-bold text-slate-900"> "{bookData.title}"</span>?
                            </p>
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold shadow-lg shadow-red-500/25 transition-all duration-200"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default BookDetails;