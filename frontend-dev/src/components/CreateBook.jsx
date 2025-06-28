import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const genres = [
    "Fiction", "Non-Fiction", "Science Fiction", "Fantasy",
    "Biography", "Mystery", "Romance", "Horror", "Self-Help", "Other"
];

const MAX_FILE_SIZES = {
    uploadThumbnail: 2 * 1024 * 1024,
    uploadPDF: 10 * 1024 * 1024,
    uploadVideo: 50 * 1024 * 1024,
};

export default function CreateBook() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        title: "", author: "", genre: "", bookType: "physical",
        count: "", summary: "",
        uploadPDF: null, uploadThumbnail: null, uploadVideo: null,
        pdfURL: "", thumbnailURL: "", videoURL: ""
    });

    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    const [preview, setPreview] = useState({ thumbnail: null, pdf: null, video: null });

    const [inputMode, setInputMode] = useState({
        thumbnail: "file",
        pdf: "file",
        video: "file"
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files && files[0]) {
            const file = files[0];
            const maxSize = MAX_FILE_SIZES[name];
            if (maxSize && file.size > maxSize) {
                setErrors((prev) => ({
                    ...prev,
                    [name]: `File too large. Max allowed: ${maxSize / 1024 / 1024} MB`
                }));
                return;
            }

            setErrors((prev) => ({ ...prev, [name]: "" }));
            setFormData((prev) => ({ ...prev, [name]: file }));

            const url = URL.createObjectURL(file);
            if (name === "uploadThumbnail") setPreview((prev) => ({ ...prev, thumbnail: url }));
            else if (name === "uploadPDF") setPreview((prev) => ({ ...prev, pdf: url }));
            else if (name === "uploadVideo") setPreview((prev) => ({ ...prev, video: url }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setErrors({});
        const data = new FormData();

        data.append("title", formData.title.trim());
        data.append("author", formData.author.trim());
        data.append("genre", formData.genre);
        data.append("bookType", formData.bookType);
        data.append("summary", formData.summary.trim());

        if ((formData.bookType === "physical" || formData.bookType === "both") && formData.count) {
            data.append("count", Number(formData.count));
        }

        // Add thumbnail
        if (inputMode.thumbnail === "file" && formData.uploadThumbnail) {
            data.append("uploadThumbnail", formData.uploadThumbnail);
        } else if (inputMode.thumbnail === "url" && formData.thumbnailURL) {
            data.append("thumbnailURL", formData.thumbnailURL);
        }

        // Add PDF
        if ((formData.bookType === "ebook" || formData.bookType === "both")) {
            if (inputMode.pdf === "file" && formData.uploadPDF) {
                data.append("uploadPDF", formData.uploadPDF);
            } else if (inputMode.pdf === "url" && formData.pdfURL) {
                data.append("pdfURL", formData.pdfURL);
            }
        }

        // Add Video
        if ((formData.bookType === "ebook" || formData.bookType === "both")) {
            if (inputMode.video === "file" && formData.uploadVideo) {
                data.append("uploadVideo", formData.uploadVideo);
            } else if (inputMode.video === "url" && formData.videoURL) {
                data.append("videoURL", formData.videoURL);
            }
        }

        try {
            setLoading(true);
            const response = await fetch(`${SERVER_URL}/book/createbook`, {
                method: "POST",
                body: data,
            });

            const result = await response.json();
            if (!response.ok) {
                if (result?.details?.length) toast.error(result.details[0]);
                else toast.error(result?.error || "Failed to create book");
                return;
            }

            toast.success("✅ Book Created Successfully!");
            setModalOpen(true);
        } catch (err) {
            console.error(err);
            toast.error("❌ Error creating book");
        } finally {
            setLoading(false);
        }
    };

    const toggleInputMode = (field) => {
        setInputMode((prev) => ({
            ...prev,
            [field]: prev[field] === "file" ? "url" : "file"
        }));
    };

    useEffect(() => {
        let timer;
        if (modalOpen) {
            timer = setTimeout(() => {
                setModalOpen(false);
                navigate("/all-books");
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [modalOpen,navigate]);

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto w-full text-[#1E293B]">
            <Toaster position="top-right" />
            <div className="mb-4">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="font-bold text-2xl"
                >
                    Create Book
                </motion.h1>
            </div>

            <button
                onClick={() => navigate(-1)}
                className="text-sm flex gap-2 p-2 rounded bg-white shadow hover:underline text-blue-800 mb-4"
            >
                <ArrowLeft size={18} /> Go back
            </button>

            <form
                onSubmit={handleCreate}
                className="bg-white shadow-lg rounded-xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                <Input label="Title" name="title" value={formData.title} onChange={handleChange} disabled={loading} required />
                <Input label="Author" name="author" value={formData.author} onChange={handleChange} disabled={loading} required />
                <Dropdown label="Genre" name="genre" value={formData.genre} onChange={handleChange} options={genres} disabled={loading} />
                <Dropdown label="Book Type" name="bookType" value={formData.bookType} onChange={handleChange} options={["physical", "ebook", "both"]} disabled={loading} />

                {(formData.bookType === "physical" || formData.bookType === "both") && (
                    <Input label="Count" name="count" type="number" value={formData.count} onChange={handleChange} min={1} disabled={loading} required />
                )}

                <div className="col-span-2">
                    <ToggleInputSection
                        label="Book Thumbnail"
                        inputMode={inputMode.thumbnail}
                        toggle={() => toggleInputMode("thumbnail")}
                        fileInputProps={{ name: "uploadThumbnail", onChange: handleChange, disabled: loading }}
                        urlInputProps={{ name: "thumbnailURL", value: formData.thumbnailURL, onChange: handleChange, disabled: loading }}
                    />
                </div>

                {(formData.bookType === "ebook" || formData.bookType === "both") && (
                    <>
                        <div className="col-span-2">
                            <ToggleInputSection
                                label="Upload PDF"
                                inputMode={inputMode.pdf}
                                toggle={() => toggleInputMode("pdf")}
                                fileInputProps={{ name: "uploadPDF", onChange: handleChange, disabled: loading }}
                                urlInputProps={{ name: "pdfURL", value: formData.pdfURL, onChange: handleChange, disabled: loading }}
                            />
                        </div>

                        <div className="col-span-2">
                            <ToggleInputSection
                                label="Book Video"
                                inputMode={inputMode.video}
                                toggle={() => toggleInputMode("video")}
                                fileInputProps={{ name: "uploadVideo", onChange: handleChange, disabled: loading }}
                                urlInputProps={{ name: "videoURL", value: formData.videoURL, onChange: handleChange, disabled: loading }}
                            />
                        </div>
                    </>
                )}

                <div className="col-span-2">
                    <TextArea label="Summary" name="summary" value={formData.summary} onChange={handleChange} disabled={loading} />
                </div>

                <div className="col-span-2 flex flex-col gap-2">
                    <button
                        type="submit"
                        className="w-full py-2 rounded bg-blue-800 text-white hover:bg-blue-900 transition disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Book"}
                    </button>
                </div>
            </form>

            {modalOpen && (
                <motion.div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md text-center"
                    >
                        <h2 className="text-xl font-semibold text-[#1E293B] mb-2">🎉 Book Created!</h2>
                        <p className="text-sm text-[#475569] mb-4">Redirecting to all books...</p>
                        <button onClick={() => navigate("/all-books")} className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900">Close Now</button>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}

function Input({ label, name, value, onChange, type = "text", placeholder, disabled, required, min }) {
    return (
        <div className="flex flex-col">
            <label htmlFor={name} className="mb-1 text-sm">{label}</label>
            <input
                type={type}
                id={name}
                name={name}
                value={type === "file" ? undefined : value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                min={min}
                className="bg-[#F9FAFB] border px-3 py-2 rounded shadow-sm text-[#0F172A]"
            />
        </div>
    );
}

function TextArea({ label, name, value, onChange, placeholder, disabled }) {
    return (
        <div className="flex flex-col">
            <label htmlFor={name} className="mb-1 text-sm">{label}</label>
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                rows={4}
                className="bg-[#F9FAFB] border px-3 py-2 rounded shadow-sm"
            />
        </div>
    );
}

function Dropdown({ label, name, value, onChange, options, disabled }) {
    return (
        <div className="flex flex-col">
            <label htmlFor={name} className="mb-1 text-sm">{label}</label>
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required
                className="bg-[#F9FAFB] border px-3 py-2 rounded shadow-sm"
            >
                <option value="" disabled>Select {label}</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );
}

function ToggleInputSection({ label, inputMode, toggle, fileInputProps, urlInputProps }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{label}</label>
                <button type="button" onClick={toggle} className="text-blue-600 text-xs underline">
                    Switch to {inputMode === "file" ? "URL" : "File"}
                </button>
            </div>
            {inputMode === "file" ? (
                <input type="file" className="bg-white" {...fileInputProps} />
            ) : (
                <input
                    type="url"
                    className="bg-[#F9FAFB] border px-3 py-2 rounded shadow-sm"
                    placeholder={`Paste ${label.toLowerCase()} link here`}
                    {...urlInputProps}
                />
            )}
        </div>
    );
}
