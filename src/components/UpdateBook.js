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
  const [bookType, setBookType] = useState("physical"); // New state for book type
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    count: "",
    summary: "",
    thumbnail: null,
    video: null,
    pdf: null,
    borrowedCount: 0,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [previewPdf, setPreviewPdf] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setError(null);
        const response = await fetch(`http://localhost:4000/book/fetch/${bookId}`);
        if (!response.ok) throw new Error("Failed to fetch book");

        const data = await response.json();
        if (!data.success) throw new Error(data.error || "Failed to fetch book");

        const book = data.book;
        const borrowedCount = book.count - (book.available || 0);

        // Set book type based on existing data
        let detectedBookType = "physical";
        if (book.pdfCloudinary && book.videoCloudinary && book.count > 0) {
          detectedBookType = "both";
        } else if (book.pdfCloudinary || book.videoCloudinary) {
          detectedBookType = "ebook";
        }

        setBookType(detectedBookType);
        setFormData({
          title: book.title || "",
          author: book.author || "",
          genre: book.genre || "",
          count: book.count?.toString() || "0",
          summary: book.summary || "",
          thumbnail: null,
          video: null,
          pdf: null,
          borrowedCount,
        });

        setPreviewImage(book.thumbnailCloudinary?.secure_url || null);
        setPreviewVideo(book.videoCloudinary?.secure_url || null);
        setPreviewPdf(book.pdfCloudinary?.secure_url || null);
      } catch (err) {
        setError(err.message || "Failed to load book data");
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
      const fileURL = URL.createObjectURL(file);
      if (name === "thumbnail") setPreviewImage(fileURL);
      if (name === "video") setPreviewVideo(fileURL);
      if (name === "pdf") setPreviewPdf(fileURL);
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
      
      // Validation based on book type
      if (bookType === "physical" || bookType === "both") {
        const newCount = parseInt(count);
        if (isNaN(newCount) || newCount < 0) {
          throw new Error("Count must be a valid positive number");
        }
        if (newCount < borrowedCount) {
          throw new Error(`Cannot set count less than borrowed books (${borrowedCount})`);
        }
      }

      const updateData = new FormData();
      updateData.append("title", title);
      updateData.append("author", author);
      updateData.append("genre", genre);
      updateData.append("summary", summary);
      updateData.append("bookType", bookType);
      
      // Add fields based on book type
      if (bookType === "physical" || bookType === "both") {
        updateData.append("count", parseInt(count));
      }
      
      if (formData.thumbnail) updateData.append("thumbnail", formData.thumbnail);
      
      if (bookType === "ebook" || bookType === "both") {
        if (formData.video) updateData.append("video", formData.video);
        if (formData.pdf) updateData.append("pdf", formData.pdf);
      }

      setLoading(true);
      const res = await fetch(`http://localhost:4000/book/update/${bookId}`, {
        method: "PUT",
        body: updateData,
      });

      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.error || "Update failed");

      setSuccess(true);
      toast.success("Book updated successfully!");
      setTimeout(() => navigate("/all-books"), 2000);
    } catch (err) {
      toast.error(err.message || "Failed to update book");
      setError(err.message || "Failed to update book");
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
      if (!res.ok) throw new Error(data.error || "Failed to delete");

      toast.success("Book deleted successfully");
      navigate("/all-books");
    } catch (err) {
      toast.error(err.message || "Delete failed");
      setError(err.message);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const renderFormFields = () => {
    return (
      <>
        <Input label="Title" name="title" value={formData.title} onChange={handleChange} required />
        <Input label="Author" name="author" value={formData.author} onChange={handleChange} required />
        <Input label="Genre" name="genre" value={formData.genre} onChange={handleChange} required />
        <TextArea label="Summary" name="summary" value={formData.summary} onChange={handleChange} />
        
        {/* Book Type Selection - DISABLED */}
        <div className="flex flex-col">
          <label className="text-sm text-slate-700 mb-1">Book Type</label>
          <select
            value={bookType}
            disabled={true}
            className="border border-slate-300 rounded px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
          >
            <option value="physical">Physical Book</option>
            <option value="ebook">E-Book</option>
            <option value="both">Both (Physical + E-Book)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Book type cannot be changed during update</p>
        </div>

        {/* Conditional Count Field */}
        {(bookType === "physical" || bookType === "both") && (
          <Input 
            label="Physical Book Count" 
            name="count" 
            type="number" 
            min={formData.borrowedCount} 
            value={formData.count} 
            onChange={handleChange}
            required
          />
        )}

        {/* Thumbnail - Always present */}
        <FileInput 
          label="Thumbnail" 
          name="thumbnail" 
          preview={previewImage} 
          onChange={handleChange} 
        />

        {/* Conditional PDF and Video Fields */}
        {(bookType === "ebook" || bookType === "both") && (
          <>
            <FileInput 
              label="PDF File" 
              name="pdf" 
              preview={previewPdf} 
              onChange={handleChange} 
              isPdf 
            />
            <FileInput 
              label="Video Preview" 
              name="video" 
              preview={previewVideo} 
              onChange={handleChange} 
              isVideo 
            />
          </>
        )}
      </>
    );
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen flex flex-col items-center">
      <Toaster />
      {loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <DotLottieReact
            src="https://lottie.host/30343234-4dd3-4a90-84d0-ef7389a4a36d/Rc90bCcw76.lottie"
            loop
            autoplay
          />
        </div>
      ) : success ? (
        <div className="flex flex-col items-center mt-20">
          <DotLottieReact
            src="https://lottie.host/ef00bf6e-4944-4578-a023-04daccc092c0/qK4UF06nFN.lottie"
            loop
            autoplay
          />
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
            <button
              onClick={() => navigate(-1)}
              className="mb-4 flex items-center gap-2 text-blue-600 hover:underline text-sm"
            >
              <ArrowLeft size={16} /> Go Back
            </button>

            {error && (
              <div className="bg-red-100 p-4 rounded text-red-800 mb-4">
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="underline text-sm mt-2">
                  Retry
                </button>
              </div>
            )}

            <form onSubmit={handleUpdate} className="bg-white rounded-lg shadow p-6 space-y-5">
              {/* Show borrowed count warning only for physical books */}
              {(bookType === "physical" || bookType === "both") && formData.borrowedCount > 0 && (
                <div className="bg-yellow-100 p-3 rounded text-yellow-700 text-sm">
                  <p>{formData.borrowedCount} books are currently borrowed. Total count must be at least this value.</p>
                </div>
              )}

              {/* Book Type Information */}
              <div className="bg-blue-50 p-3 rounded text-blue-700 text-sm">
                <p><strong>Current Book Type:</strong> {bookType === "physical" ? "Physical Book" : bookType === "ebook" ? "E-Book" : "Both (Physical + E-Book)"}</p>
                <p className="text-xs mt-1">
                  {bookType === "physical" && "Physical books require count and thumbnail."}
                  {bookType === "ebook" && "E-books require PDF, video, and thumbnail."}
                  {bookType === "both" && "Both types require count, PDF, video, and thumbnail."}
                </p>
              </div>

              {renderFormFields()}

              <div className="flex justify-between items-center">
                <button 
                  type="submit" 
                  className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Book"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete Book
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow w-[90%] max-w-sm text-center space-y-4">
            <h2 className="text-lg font-semibold text-red-600">Delete Book?</h2>
            <p className="text-gray-700 text-sm">Are you sure? This cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-1 bg-gray-100 rounded hover:bg-gray-200">Cancel</button>
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
      <label className="text-sm text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        required={required}
        className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
    </div>
  );
}

function TextArea({ label, ...props }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-slate-700 mb-1">{label}</label>
      <textarea
        rows="4"
        className="border border-slate-300 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
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
        className="block w-full text-sm text-slate-600 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
      />
      {preview && (
        isVideo ? (
          <video src={preview} controls className="rounded w-64 h-40 object-cover shadow" />
        ) : isPdf ? (
          <iframe src={preview} className="w-full h-64 rounded shadow" title="PDF Preview" />
        ) : (
          <img src={preview} alt="Preview" className="rounded w-40 h-40 object-cover shadow" />
        )
      )}
    </div>
  );
}