import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

export default function AllBooks() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "title", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const booksPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/book/fetchall`);
        if (!response.ok) throw new Error("Network error");
        const data = await response.json();
        setBooks(data.books || []);
      } catch (error) {
        console.error("Fetch failed:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookData();
  }, []);

  const allGenres = Array.from(new Set(books.map((b) => b.genre).filter(Boolean)));
  const allAuthors = Array.from(new Set(books.map((b) => b.author).filter(Boolean)));

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      (book.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (book.author || "").toLowerCase().includes(search.toLowerCase()) ||
      (book.genre || "").toLowerCase().includes(search.toLowerCase());
    const matchesGenre = selectedGenre ? book.genre === selectedGenre : true;
    const matchesAuthor = selectedAuthor ? book.author === selectedAuthor : true;
    return matchesSearch && matchesGenre && matchesAuthor;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (key === "title") {
      const titleA = (a.title || "").toLowerCase();
      const titleB = (b.title || "").toLowerCase();
      if (titleA < titleB) return direction === "asc" ? -1 : 1;
      if (titleA > titleB) return direction === "asc" ? 1 : -1;
      return 0;
    } else if (key === "updatedAt") {
      const dateA = new Date(a.updatedAt);
      const dateB = new Date(b.updatedAt);
      if (dateA < dateB) return direction === "asc" ? -1 : 1;
      if (dateA > dateB) return direction === "asc" ? 1 : -1;
      return 0;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);
  const currentBooks = sortedBooks.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage);

  const formatDate = (iso) => {
    const date = new Date(iso);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  };

  const renderBookImageOrFallback = (book) => {
    if (book?.image) {
      return <img src={book.image} alt="cover" className="w-10 h-14 object-cover rounded" />;
    } else {
      const fallbackText = (book?.title || "NA").substring(0, 2).toUpperCase();
      return (
        <div className="w-10 h-14 flex items-center justify-center bg-gray-300 text-sm font-bold text-gray-700 rounded">
          {fallbackText}
        </div>
      );
    }
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setShowModal(true);
  };

  const confirmDeleteBook = async () => {
    try {
      const response = await fetch(`http://localhost:4000/book/delete/${bookToDelete._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Delete failed");
      const result = await response.json();
      setBooks((prev) => prev.filter((b) => b._id !== bookToDelete._id));
      toast.success(result.message || "Book deleted!");
    } catch (err) {
      toast.error("Delete failed!");
      console.error(err);
    } finally {
      setShowModal(false);
      setBookToDelete(null);
    }
  };

  const handleSortClick = (key) => {
    setSortConfig((current) => {
      if (current.key === key) {
        return { key, direction: current.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
    setCurrentPage(1);
  };

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="p-6 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-1">Welcome, Adrian</h1>
        <p className="text-sm text-gray-500 mb-6">Monitor all of your projects and tasks here</p>

        <div className="flex flex-col gap-4 mb-4 bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">All Books</h2>

          <div className="flex flex-row md:items-center md:justify-between gap-3">
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="Search by title, author, or genre"
                className="w-full px-4 py-2 border rounded shadow-sm"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={selectedGenre}
                onChange={(e) => {
                  setSelectedGenre(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border rounded shadow-sm bg-white"
              >
                <option value="">All Genres</option>
                {allGenres.map((genre, i) => (
                  <option key={i} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>

              <select
                value={selectedAuthor}
                onChange={(e) => {
                  setSelectedAuthor(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border rounded shadow-sm bg-white"
              >
                <option value="">All Authors</option>
                {allAuthors.map((author, i) => (
                  <option key={i} value={author}>
                    {author}
                  </option>
                ))}
              </select>

              <button
                onClick={() => navigate("/createBook")}
                className="px-4 py-2 bg-blue-700 text-white rounded flex items-center gap-2 hover:cursor-pointer transition-transform duration-200"
              >
                <Plus size={16} /> Create a New Book
              </button>
            </div>
          </div>

          {loading ? (
            <SkeletonTable />
          ) : currentBooks.length === 0 ? (
            <NoResultsFallback searchTerm={search} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left table-fixed min-w-[700px]">
                <thead>
                  <tr className="text-gray-600 bg-[#F8F8FF] p-2">
                    <th
                      className="py-2 pl-2 cursor-pointer select-none w-[40%]"
                      onClick={() => handleSortClick("title")}
                    >
                      Book Title{renderSortArrow("title")}
                    </th>
                    <th className="w-[20%]">Author</th>
                    <th className="w-[15%]">Genre</th>
                    <th
                      className="cursor-pointer select-none w-[15%]"
                      onClick={() => handleSortClick("updatedAt")}
                    >
                      Date Updated{renderSortArrow("updatedAt")}
                    </th>
                    <th className="w-[10%]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBooks.map((book) => (
                    <tr key={book._id} className="hover:bg-gray-50 transition-all duration-300">
                      <td className="py-2 pl-2 flex items-center gap-2">
                        {renderBookImageOrFallback(book)}
                        <span>{book.title}</span>
                      </td>
                      <td>{book.author}</td>
                      <td>{book.genre}</td>
                      <td>{formatDate(book.updatedAt)}</td>
                      <td className="flex items-center gap-4">
                        <button
                          className="text-blue-700 hover:opacity-80 transition-opacity duration-200"
                          onClick={() => navigate(`/update/${book._id}`)}
                          aria-label={`Edit ${book.title}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="text-red-700 hover:opacity-80 transition-opacity duration-200"
                          onClick={() => handleDeleteClick(book)}
                          aria-label={`Delete ${book.title}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>

        {/* Custom Delete Confirmation Modal */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
              <h3 id="modal-title" className="text-lg font-semibold mb-4">
                Confirm Deletion
              </h3>
              <p className="mb-6">
                Are you sure you want to delete the book <strong>{bookToDelete?.title}</strong>?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setBookToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteBook}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


function Pagination({ currentPage, totalPages, setCurrentPage }) {
  return (
    <nav
      className="mt-6 flex justify-center gap-6 select-none"
      aria-label="Pagination Navigation"
    >
      <motion.button
        whileHover={currentPage !== 1 ? { scale: 1.1, backgroundColor: "#2563EB", color: "#fff", boxShadow: "0 4px 10px rgba(37, 99, 235, 0.5)" } : {}}
        whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          px-5 py-2 rounded-lg border border-gray-300
          focus:outline-none focus:ring-2 focus:ring-blue-400
          ${currentPage === 1 ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400" : "bg-white text-gray-700"}
        `}
        aria-label="Previous page"
      >
        &lt; Prev
      </motion.button>

      <motion.span
        layout
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="
          px-7 py-2 rounded-lg border border-blue-600 bg-blue-50
          font-semibold text-blue-700 select-none shadow-inner
        "
      >
        {currentPage} / {totalPages}
      </motion.span>

      <motion.button
        whileHover={currentPage !== totalPages ? { scale: 1.1, backgroundColor: "#2563EB", color: "#fff", boxShadow: "0 4px 10px rgba(37, 99, 235, 0.5)" } : {}}
        whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
        onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          px-5 py-2 rounded-lg border border-gray-300
          focus:outline-none focus:ring-2 focus:ring-blue-400
          ${currentPage === totalPages ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400" : "bg-white text-gray-700"}
        `}
        aria-label="Next page"
      >
        Next &gt;
      </motion.button>
    </nav>
  );
}


function SkeletonTable() {
  // Simple skeleton placeholders for loading state
  return (
    <table className="w-full text-sm text-left min-w-[700px]">
      <thead>
        <tr className="bg-gray-100">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <th key={i} className="p-4">
                <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
              </th>
            ))}
        </tr>
      </thead>
      <tbody>
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <tr key={i} className="border-b border-gray-200">
              {Array(5)
                .fill(0)
                .map((_, j) => (
                  <td key={j} className="p-4">
                    <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                  </td>
                ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
}

function NoResultsFallback({ searchTerm }) {
  return (
    <div className="text-center py-10 text-gray-600 text-lg">
      No results found for "<span className="font-semibold">{searchTerm}</span>"
    </div>
  );
}
