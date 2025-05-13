import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react'; // Ensure you have lucide-react installed

const BookDetails = ({ book, isLoading }) => {
    const [bookData, setBookData] = useState(book);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!book) {
            const fallbackBook = {
                title: "The Lost Pages",
                author: "Jane Doe",
                createdAt: new Date().toISOString(),
                summary:
                    "An intriguing tale of mystery, betrayal, and hidden knowledge waiting to be uncovered.",
                thumbnail: "https://via.placeholder.com/150x220.png?text=Book+Cover",
                video: null,
            };
            setBookData(fallbackBook);
        } else {
            setBookData(book);
        }
    }, [book]);

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 animate-pulse">
                <div className="flex justify-between items-center mb-4">
                    <div className="h-6 bg-gray-300 rounded w-1/4" />
                    <div className="flex space-x-4">
                        <div className="h-10 w-24 bg-gray-300 rounded" />
                        <div className="h-10 w-64 bg-gray-300 rounded" />
                    </div>
                </div>
                <div className="flex space-x-6">
                    <div className="w-40 h-60 bg-gray-300 rounded-lg" />
                    <div className="flex-1 space-y-4">
                        <div className="h-6 bg-gray-300 rounded w-1/3" />
                        <div className="h-4 bg-gray-300 rounded w-1/4" />
                        <div className="h-4 bg-gray-300 rounded w-1/2" />
                        <div className="h-24 bg-gray-300 rounded" />
                        <div className="h-10 w-32 bg-gray-300 rounded" />
                    </div>
                </div>
                <div className="mt-6">
                    <div className="h-6 bg-gray-300 rounded w-1/4 mb-2" />
                    <div className="w-full h-56 bg-gray-300 rounded" />
                </div>
            </div>
        );
    }

    if (!bookData) {
        return (
            <div className="container mx-auto p-4 text-center text-gray-500">
                <p>No book data available.</p>
            </div>
        );
    }

    return (
        <motion.div
            className="container mx-auto p-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Header */}
            <div className="mb-6">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="font-bold text-2xl"
                >
                    Welcome, Adrian
                </motion.h1>
                <p className="text-sm text-[#64748B]">Monitor all of your projects and tasks here</p>
            </div>

            {/* Go Back Button */}
            <div className="mb-4">
                <button className="text-sm flex items-center gap-2 mb-5 p-2 rounded-md shadow-md hover:shadow-xl transition duration-300 bg-white text-[#25388C] hover:underline">
                    <ArrowLeft size={18} />
                    Go back
                </button>
            </div>

            {/* Book Info */}
            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
                {/* Thumbnail */}
                <motion.div
                    className="w-40 h-60 bg-gray-200 rounded-lg overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                >
                    <img
                        src={bookData.thumbnail}
                        alt={bookData.title}
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                {/* Metadata */}
                <div className="flex-1">
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold">{bookData.title}</h3>
                        <p className="text-sm text-gray-500">By {bookData.author}</p>
                        <p className="text-sm text-gray-500">
                            Created at: {new Date(bookData.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="mt-4">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleEdit}
                            className="bg-[#25388C] text-white font-semibold tracking-wide py-3 px-8 text-md rounded-xl 
                   shadow-md hover:shadow-xl hover:bg-[#1d2d70] transform transition-all duration-300 ease-in-out"
                        >
                            {isEditing ? 'Save Changes' : 'Edit Book'}
                        </motion.button>
                    </div>

                </div>
            </div>

            {/* Summary & Video Side-by-Side */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Summary */}
                <div className="p-4 ">
                    <p className="font-medium text-lg mb-2">Summary</p>
                    <p className="text-sm text-gray-700">{bookData.summary}</p>
                </div>

                {/* Video */}
                <div className="p-4 ">
                    <p className="font-medium text-lg mb-2">Video</p>
                    {bookData.video ? (
                        <video
                            src={bookData.video}
                            controls
                            className="w-full h-56 object-cover rounded-lg"
                        >
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <div className="w-full h-56 bg-gray-200 rounded-lg flex justify-center items-center">
                            <span className="text-gray-500">No video available.</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default BookDetails;
