import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function CreateBook() {
    const [loading, setLoading] = useState(false);

    const handleCreate = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert("Book Created!");
        }, 2000);
    };

    return (
        <div className="p-6 flex flex-col gap-6 text-[#1E293B]">
            <div>
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

            <div className="transition-all duration-300">
                <button className="text-sm flex flex-row gap-2 mb-4 p-2 rounded-md shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-white text-[#25388C] hover:underline">
                    <ArrowLeft size={18} />
                    Go back
                </button>

                {loading ? (
                    <Skeleton count={10} height={40} className="mb-2" />
                ) : (
                    <form onSubmit={handleCreate} className="space-y-4">
                        <Input label="Book Title" placeholder="Enter the book title" />
                        <Input label="Author" placeholder="Enter the author name" />
                        <Input label="Genre" placeholder="Enter the genre of the book" />
                        <Input label="Total number of books" type="number" placeholder="Enter the total number of books" />
                        <Input label="Book Image" type="file" />
                        <Input label="Book Video" type="file" />
                        <TextArea label="Book Summary" placeholder="Write a brief summary of the book" />
                        <button
                            type="submit"
                            className="w-full py-2 rounded bg-blue-800 text-white hover:bg-blue-900 transition"
                        >
                            Create Book
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

function Input({ label, type = "text", placeholder }) {
    const inputStyles = `
        bg-[#F9FAFB] border px-3 py-2 rounded shadow-sm focus:outline-blue-500 
        placeholder-[#64748B] text-[#0F172A]
    `;

    return (
        <div className="flex flex-col">
            <label className="mb-1 text-sm text-[#0F172A]">{label}</label>
            {type === "file" ? (
                <input
                    type="file"
                    className="bg-[#F9FAFB] border text-[#0F172A] file:mr-4 file:py-2 file:px-4 
                               file:rounded file:border-0 file:text-sm file:font-semibold 
                               file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            ) : (
                <input type={type} placeholder={placeholder} className={inputStyles} />
            )}
        </div>
    );
}

function TextArea({ label, placeholder }) {
    return (
        <div className="flex flex-col">
            <label className="mb-1 text-sm text-[#0F172A]">{label}</label>
            <textarea
                placeholder={placeholder}
                className="bg-[#F9FAFB] border px-3 py-2 rounded shadow-sm resize-none focus:outline-blue-500 placeholder-[#64748B] text-[#0F172A]"
                rows={5}
            />
        </div>
    );
}
