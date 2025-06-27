'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const UnverifiedUserModal = ({ closeModal, isModalOpen, handleExplore }) => {
    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                onClick={closeModal}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
            />

            {/* Modal Content */}
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
                className="relative bg-white border border-gray-300 rounded-3xl p-8 max-w-md w-full shadow-xl"
            >
                {/* Close Button */}
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Animation */}
                <div className="w-44 h-44 mx-auto mb-6">
                    <DotLottieReact
                        src="https://lottie.host/e98273f0-461f-4270-af22-8d49ddd0cebc/UebRFJIb7M.lottie"
                        loop
                        autoplay
                    />
                </div>

                {/* Header */}
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Welcome, Explorer!
                    </h2>
                    <p className="text-gray-600 text-sm">
                        You are currently <span className="text-red-500 font-semibold">not verified</span>, so you can’t create, update, or delete books/users yet.
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                        But no worries — you can still explore and navigate the admin dashboard!
                    </p>
                </div>

                {/* Action Button */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleExplore}
                        className="relative group bg-gradient-to-r from-blue-200 to-blue-500 text-gray-900 px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-blue-200 transition-all duration-300"
                    >
                        <span className="relative z-10">Let’s Explore</span>
                        <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default UnverifiedUserModal;
