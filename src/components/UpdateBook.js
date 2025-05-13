import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function UpdateBook() {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        genre: "",
        count: "",
        summary: "",
        image: null,
        video: null,
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [previewVideo, setPreviewVideo] = useState(null);

    useEffect(() => {
        // Simulate fetching book data from an API
        setTimeout(() => {
            setFormData({
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                genre: "Classic Fiction",
                count: "5",
                summary: "A novel set in the Roaring Twenties.",
                image: null,
                video: null,
            });
            setLoading(false);
        }, 1500);
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            const file = files[0];
            setFormData((prev) => ({ ...prev, [name]: file }));

            // Preview logic
            const fileURL = URL.createObjectURL(file);
            if (name === "image") setPreviewImage(fileURL);
            else if (name === "video") setPreviewVideo(fileURL);
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        alert("Book Updated!");
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
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <Input
                            label="Book Title"
                            name="title"
                            value={formData.title}
                            placeholder="Enter the book title"
                            onChange={handleChange}
                        />
                        <Input
                            label="Author"
                            name="author"
                            value={formData.author}
                            placeholder="Enter the author name"
                            onChange={handleChange}
                        />
                        <Input
                            label="Genre"
                            name="genre"
                            value={formData.genre}
                            placeholder="Enter the genre of the book"
                            onChange={handleChange}
                        />
                        <Input
                            label="Total number of books"
                            name="count"
                            type="number"
                            value={formData.count}
                            placeholder="Enter the total number of books"
                            onChange={handleChange}
                        />
                        <FileInput
                            label="Book Image"
                            name="image"
                            onChange={handleChange}
                            preview={previewImage}
                        />
                        <FileInput
                            label="Book Video"
                            name="video"
                            onChange={handleChange}
                            preview={previewVideo}
                            isVideo
                        />
                        <TextArea
                            label="Book Summary"
                            name="summary"
                            value={formData.summary}
                            onChange={handleChange}
                            placeholder="Write a brief summary of the book"
                        />
                        <button
                            type="submit"
                            className="w-full py-2 rounded bg-blue-800 text-white hover:bg-blue-900 transition"
                        >
                            Update Book
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

function Input({ label, type = "text", placeholder, name, value, onChange }) {
    const inputStyles =
        "bg-[#F9FAFB] border px-3 py-2 rounded shadow-sm focus:outline-blue-500 placeholder-[#64748B] text-[#0F172A]";
    return (
        <div className="flex flex-col">
            <label className="mb-1 text-sm text-[#0F172A]">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                className={inputStyles}
                onChange={onChange}
            />
        </div>
    );
}

function FileInput({ label, name, onChange, preview, isVideo = false }) {
    return (
        <div className="flex flex-col">
            <label className="mb-1 text-sm text-[#0F172A]">{label}</label>
            <input
                type="file"
                name={name}
                onChange={onChange}
                className="bg-[#F9FAFB] border px-3 py-2 rounded shadow-sm text-[#0F172A] file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
            {preview &&
                (isVideo ? (
                    <video src={preview} controls className="mt-2 max-w-sm rounded-md shadow" />
                ) : (
                    <img src={preview} alt="preview" className="mt-2 w-32 rounded-md shadow" />
                ))}
        </div>
    );
}

function TextArea({ label, name, value, onChange, placeholder }) {
    return (
        <div className="flex flex-col">
            <label className="mb-1 text-sm text-[#0F172A]">{label}</label>
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="bg-[#F9FAFB] border px-3 py-2 rounded shadow-sm resize-none focus:outline-blue-500 placeholder-[#64748B] text-[#0F172A]"
                rows={5}
            />
        </div>
    );
}
