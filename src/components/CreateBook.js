import { useState, useEffect } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CreateBook() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        genre: "",
        count: "",
        summary: "",
        uploadPDF: null,
        uploadThumbnail: null,
        uploadVideo: null,
    });
    const [preview, setPreview] = useState({
        thumbnail: null,
        pdf: null,
        video: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            const file = files[0];
            setFormData((prev) => ({ ...prev, [name]: file }));

            if (name === "uploadThumbnail") {
                setPreview((prev) => ({ ...prev, thumbnail: URL.createObjectURL(file) }));
            } else if (name === "uploadPDF") {
                setPreview((prev) => ({ ...prev, pdf: URL.createObjectURL(file) }));
            } else if (name === "uploadVideo") {
                setPreview((prev) => ({ ...prev, video: URL.createObjectURL(file) }));
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("author", formData.author);
            data.append("genre", formData.genre);
            data.append("summary", formData.summary);
            data.append("count", formData.count);
            data.append("uploadPDF", formData.uploadPDF);
            if (formData.uploadThumbnail) data.append("uploadThumbnail", formData.uploadThumbnail);
            if (formData.uploadVideo) data.append("uploadVideo", formData.uploadVideo);

            const response = await fetch("http://localhost:4000/book/createbook", {
                method: "POST",
                body: data,
            });

            if (!response.ok) throw new Error("Failed to create book");

            toast.success("✅ Book Created Successfully!");
            setModalOpen(true);
        } catch (err) {
            console.error(err);
            toast.error("❌ Error creating book");
        } finally {
            setLoading(false);
        }
    };

    const closeModalAndRedirect = () => {
        setModalOpen(false);
        navigate("/all-books");
    };

    useEffect(() => {
        let timer;
        if (modalOpen) {
            timer = setTimeout(() => {
                closeModalAndRedirect();
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [modalOpen]);

    return (
        <div className="p-6 flex flex-col gap-6 text-[#1E293B]">
            <Toaster position="top-right" />

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
                <button
                    className="text-sm flex flex-row gap-2 mb-4 p-2 rounded-md shadow-md hover:shadow-xl transition-shadow duration-300  bg-white text-[#25388C] hover:underline"
                    onClick={() => navigate("/all-books")}
                >
                    <ArrowLeft size={18} />
                    Go back
                </button>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                        <DotLottieReact
                            src="https://lottie.host/9e474a26-02e5-47f5-8f80-52393103c56d/Vv2QjHTi9K.lottie"
                            loop
                            autoplay
                        />
                        <p className="text-blue-700 font-medium">Creating book...</p>
                    </div>
                ) : (
                    <form onSubmit={handleCreate} className="space-y-4">
                        <Input label="Book Title" name="title" value={formData.title} onChange={handleChange} placeholder="Enter the book title" />
                        <Input label="Author" name="author" value={formData.author} onChange={handleChange} placeholder="Enter the author name" />
                        <Input label="Genre" name="genre" value={formData.genre} onChange={handleChange} placeholder="Enter the genre of the book" />
                        <Input label="Total number of books" name="count" value={formData.count} onChange={handleChange} type="number" placeholder="Enter the total number of books" />
                        <Input label="Book Image" name="uploadThumbnail" type="file" onChange={handleChange} />
                        {preview.thumbnail && (
                            <img src={preview.thumbnail} alt="Thumbnail Preview" className="w-32 h-32 object-cover rounded shadow-md" />
                        )}
                        <Input label="Book Video" name="uploadVideo" type="file" onChange={handleChange} />
                        {preview.video && (
                            <video src={preview.video} controls className="w-64 h-auto rounded shadow-md" />
                        )}
                        <Input label="Upload PDF" name="uploadPDF" type="file" onChange={handleChange} />
                        {preview.pdf && (
                            <iframe src={preview.pdf} className="w-full h-64 border rounded" title="PDF Preview" />
                        )}
                        <TextArea label="Book Summary" name="summary" value={formData.summary} onChange={handleChange} placeholder="Write a brief summary of the book" />
                        <button type="submit" className="w-full py-2 rounded bg-blue-800 text-white hover:bg-blue-900 transition ">
                            Create Book
                        </button>
                    </form>
                )}
            </div>

            {/* Success Modal */}
            {modalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md text-center"
                    >
                        <h2 className="text-xl font-semibold text-[#1E293B] mb-2">🎉 Book Created!</h2>
                        <p className="text-sm text-[#475569] mb-4">
                            Your book has been successfully added to the library.
                            <br />
                            Redirecting to all books...
                        </p>
                        <button
                            onClick={closeModalAndRedirect}
                            className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 transition "
                        >
                            Go to All Books
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}

function Input({ label, name, type = "text", placeholder, value, onChange }) {
    const inputStyles = `
        bg-[#F9FAFB] border px-3 py-2 rounded shadow-sm focus:outline-blue-500 
        placeholder-[#64748B] text-[#0F172A]
    `;

    return (
        <div className="flex flex-col">
            <label htmlFor={name} className="mb-1 text-sm text-[#0F172A]">{label}</label>
            {type === "file" ? (
                <input
                    id={name}
                    name={name}
                    type="file"
                    accept={name === "uploadPDF" ? "application/pdf" : name === "uploadVideo" ? "video/*" : "image/*"}
                    onChange={onChange}
                    className="bg-[#F9FAFB] border text-[#0F172A] file:mr-4 file:py-2 file:px-4 
                               file:rounded file:border-0 file:text-sm file:font-semibold 
                               file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            ) : (
                <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={inputStyles}
                />
            )}
        </div>
    );
}

function TextArea({ label, name, value, onChange, placeholder }) {
    return (
        <div className="flex flex-col">
            <label htmlFor={name} className="mb-1 text-sm text-[#0F172A]">{label}</label>
            <textarea
                id={name}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="bg-[#F9FAFB] border px-3 py-2 rounded shadow-sm resize-none focus:outline-blue-500 placeholder-[#64748B] text-[#0F172A]"
                rows={5}
            />
        </div>
    );
}
