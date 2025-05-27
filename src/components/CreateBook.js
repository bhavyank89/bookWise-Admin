import { useState, useEffect } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const genres = [
    "Fiction",
    "Non-Fiction",
    "Science Fiction",
    "Fantasy",
    "Biography",
    "Mystery",
    "Romance",
    "Horror",
    "Self-Help",
    "Other",
];

export default function CreateBook() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        genre: "",
        bookType: "physical", // NEW FIELD
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
            data.append("title", formData.title.trim());
            data.append("author", formData.author.trim());
            data.append("genre", formData.genre);
            data.append("bookType", formData.bookType);
            data.append("summary", formData.summary.trim());

            if (formData.bookType === "physical" || formData.bookType === "both") {
                data.append("count", Number(formData.count));
            }

            if (formData.uploadThumbnail) data.append("uploadThumbnail", formData.uploadThumbnail);
            if ((formData.bookType === "ebook" || formData.bookType === "both") && formData.uploadPDF)
                data.append("uploadPDF", formData.uploadPDF);
            if ((formData.bookType === "ebook" || formData.bookType === "both") && formData.uploadVideo)
                data.append("uploadVideo", formData.uploadVideo);

            const response = await fetch("http://localhost:4000/book/createbook", {
                method: "POST",
                body: data,
            });

            console.log("data:", data);
            console.log("Response:", response);

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

                        {/* Genre dropdown instead of free text */}
                        <div className="flex flex-col">
                            <label htmlFor="genre" className="mb-1 text-sm text-[#0F172A]">Genre</label>
                            <select
                                id="genre"
                                name="genre"
                                value={formData.genre}
                                onChange={handleChange}
                                className="bg-[#F9FAFB] border px-3 py-2 rounded shadow-sm focus:outline-blue-500 text-[#0F172A]"
                                required
                            >
                                <option value="" disabled>Select a genre</option>
                                {genres.map((g) => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="bookType" className="mb-1 text-sm text-[#0F172A]">Book Type</label>
                            <select
                                id="bookType"
                                name="bookType"
                                value={formData.bookType}
                                onChange={handleChange}
                                className="bg-[#F9FAFB] border px-3 py-2 rounded shadow-sm focus:outline-blue-500 text-[#0F172A]"
                                required
                            >
                                <option value="physical">Physical</option>
                                <option value="ebook">eBook</option>
                                <option value="both">Both</option>
                            </select>
                        </div>

                        {(formData.bookType === "physical" || formData.bookType === "both") && (
                            <Input
                                label="Total number of books"
                                name="count"
                                value={formData.count}
                                onChange={handleChange}
                                type="number"
                                placeholder="Enter the total number of books"
                                min={1}
                            />
                        )}

                        <Input label="Book Image" name="uploadThumbnail" type="file" onChange={handleChange} />
                        {preview.thumbnail && (
                            <img src={preview.thumbnail} alt="Thumbnail Preview" className="w-32 h-32 object-cover rounded shadow-md" />
                        )}
                        {(formData.bookType === "ebook" || formData.bookType === "both") && (
                            <>
                                <Input label="Upload PDF" name="uploadPDF" type="file" onChange={handleChange} />
                                {preview.pdf && (
                                    <iframe src={preview.pdf} className="w-full h-64 border rounded" title="PDF Preview" />
                                )}
                            </>
                        )}

                        {(formData.bookType === "ebook" || formData.bookType === "both") && (
                            <>
                                <Input label="Book Video" name="uploadVideo" type="file" onChange={handleChange} />
                                {preview.video && (
                                    <video src={preview.video} controls className="w-64 h-auto rounded shadow-md" />
                                )}
                            </>
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
                            className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
                        >
                            Close Now
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}

function Input({ label, name, value, onChange, type = "text", placeholder }) {
    return (
        <div className="flex flex-col">
            <label htmlFor={name} className="mb-1 text-sm text-[#0F172A]">{label}</label>
            <input
                type={type}
                id={name}
                name={name}
                value={type === "file" ? undefined : value}
                onChange={onChange}
                placeholder={placeholder}
                className="bg-[#F9FAFB] border px-3 py-2 rounded shadow-sm focus:outline-blue-500 text-[#0F172A]"
                {...(type === "file" ? { accept: type === "file" && name === "uploadPDF" ? "application/pdf" : type === "file" && name === "uploadThumbnail" ? "image/*" : "video/*" } : {})}
            />
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
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={4}
                className="bg-[#F9FAFB] border px-3 py-2 rounded shadow-sm focus:outline-blue-500 text-[#0F172A]"
            />
        </div>
    );
}
