"use client";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function UpdateBook() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [bookType, setBookType] = useState("physical");
  const [formData, setFormData] = useState({
    title: "", author: "", genre: "", count: "", summary: "",
    uploadThumbnail: null, uploadPDF: null, uploadVideo: null,
    borrowedCount: 0,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [previewPdf, setPreviewPdf] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setError(null);
        const res = await fetch(`http://localhost:4000/book/fetch/${bookId}`);
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to fetch book");

        const book = data.book;
        const borrowedCount = book.count - (book.available || 0);

        let detectedType = "physical";
        if (book.pdfCloudinary && book.videoCloudinary && book.count > 0) detectedType = "both";
        else if (book.pdfCloudinary || book.videoCloudinary) detectedType = "ebook";

        setBookType(detectedType);
        setFormData({
          title: book.title || "",
          author: book.author || "",
          genre: book.genre || "",
          count: book.count?.toString() || "0",
          summary: book.summary || "",
          uploadThumbnail: null,
          uploadPDF: null,
          uploadVideo: null,
          borrowedCount,
        });

        setPreviewImage(book.thumbnailCloudinary?.secure_url || null);
        setPreviewPdf(book.pdfCloudinary?.secure_url || null);
        setPreviewVideo(book.videoCloudinary?.secure_url || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (bookId) fetchBook();
  }, [bookId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      const previewURL = URL.createObjectURL(file);
      if (name === "uploadThumbnail") setPreviewImage(previewURL);
      if (name === "uploadPDF") setPreviewPdf(previewURL);
      if (name === "uploadVideo") setPreviewVideo(previewURL);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      const { title, author, genre, summary, count, borrowedCount } = formData;

      if ((bookType === "physical" || bookType === "both") && Number(count) < borrowedCount) {
        throw new Error(`Count must be ≥ borrowed books (${borrowedCount})`);
      }

      const data = new FormData();
      data.append("title", title);
      data.append("author", author);
      data.append("genre", genre);
      data.append("summary", summary);
      data.append("bookType", bookType);
      if (bookType === "physical" || bookType === "both") {
        data.append("count", Number(count));
      }
      if (formData.uploadThumbnail) data.append("uploadThumbnail", formData.uploadThumbnail);
      if ((bookType === "ebook" || bookType === "both") && formData.uploadPDF) {
        data.append("uploadPDF", formData.uploadPDF);
      }
      if ((bookType === "ebook" || bookType === "both") && formData.uploadVideo) {
        data.append("uploadVideo", formData.uploadVideo);
      }

      setLoading(true);
      const res = await fetch(`http://localhost:4000/book/update/${bookId}`, {
        method: "PUT",
        body: data,
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Failed to update book");

      toast.success("✅ Book updated successfully!");
      setSuccess(true);
      setTimeout(() => navigate("/all-books"), 2000);
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:4000/book/delete/${bookId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");

      toast.success("❌ Book deleted successfully");
      navigate("/all-books");
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen flex flex-col items-center">
      <Toaster />
      {loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <DotLottieReact src="https://lottie.host/30343234-4dd3-4a90-84d0-ef7389a4a36d/Rc90bCcw76.lottie" loop autoplay />
        </div>
      ) : success ? (
        <div className="flex flex-col items-center mt-20">
          <DotLottieReact src="https://lottie.host/ef00bf6e-4944-4578-a023-04daccc092c0/qK4UF06nFN.lottie" loop autoplay />
          <p className="text-green-600 text-lg font-semibold mt-4">Book updated successfully!</p>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 w-full max-w-2xl"
          >
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Update Book</h1>
            <p className="text-slate-500 text-sm">Modify book details and media files</p>
          </motion.div>

          <div className="w-full max-w-2xl">
            <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-blue-600 hover:underline text-sm">
              <ArrowLeft size={16} /> Go Back
            </button>

            {error && (
              <div className="bg-red-100 p-4 rounded text-red-800 mb-4">
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleUpdate} className="bg-white rounded-lg shadow p-6 space-y-5">
              {formData.borrowedCount > 0 && (
                <div className="bg-yellow-100 p-3 rounded text-yellow-700 text-sm">
                  <p>{formData.borrowedCount} books currently borrowed. Count must be ≥ this value.</p>
                </div>
              )}

              <Input label="Title" name="title" value={formData.title} onChange={handleChange} required />
              <Input label="Author" name="author" value={formData.author} onChange={handleChange} required />
              <Input label="Genre" name="genre" value={formData.genre} onChange={handleChange} required />
              <TextArea label="Summary" name="summary" value={formData.summary} onChange={handleChange} />

              <div className="flex flex-col">
                <label className="text-sm text-slate-700 mb-1">Book Type</label>
                <select value={bookType} disabled className="border px-3 py-2 rounded bg-gray-100 text-sm text-gray-500">
                  <option value="physical">Physical</option>
                  <option value="ebook">E-Book</option>
                  <option value="both">Both</option>
                </select>
              </div>

              {(bookType === "physical" || bookType === "both") && (
                <Input label="Count" name="count" type="number" min={formData.borrowedCount} value={formData.count} onChange={handleChange} required />
              )}

              <FileInput label="Thumbnail" name="uploadThumbnail" preview={previewImage} onChange={handleChange} />
              {(bookType === "ebook" || bookType === "both") && (
                <>
                  <FileInput label="PDF File" name="uploadPDF" isPdf preview={previewPdf} onChange={handleChange} />
                  <FileInput label="Video Preview" name="uploadVideo" isVideo preview={previewVideo} onChange={handleChange} />
                </>
              )}

              <div className="flex justify-between items-center pt-2">
                <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition">
                  {loading ? "Updating..." : "Update Book"}
                </button>
                <button onClick={() => setShowDeleteModal(true)} type="button" className="text-red-600 hover:underline text-sm">Delete Book</button>
              </div>
            </form>
          </div>
        </>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-bold text-red-600">Confirm Deletion</h2>
            <p className="text-sm text-gray-700 mt-2">This action is permanent.</p>
            <div className="flex justify-center gap-4 mt-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-1 bg-gray-200 rounded">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ label, type = "text", required = false, ...props }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-slate-700 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
      <input type={type} required={required} className="border border-slate-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-500" {...props} />
    </div>
  );
}

function TextArea({ label, ...props }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-slate-700 mb-1">{label}</label>
      <textarea rows="4" className="border border-slate-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-500 resize-none" {...props} />
    </div>
  );
}

function FileInput({ label, name, onChange, preview, isVideo = false, isPdf = false }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-slate-700">{label}</label>
      <input
        type="file"
        name={name}
        accept={isVideo ? "video/*" : isPdf ? ".pdf" : "image/*"}
        onChange={onChange}
        className="block w-full text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
      />
      {preview && (
        isVideo ? (
          <video src={preview} controls className="rounded w-full h-48 object-cover shadow" />
        ) : isPdf ? (
          <iframe src={preview} title="PDF Preview" className="w-full h-64 rounded shadow" />
        ) : (
          <img src={preview} alt="Preview" className="rounded w-40 h-40 object-cover shadow" />
        )
      )}
    </div>
  );
}
