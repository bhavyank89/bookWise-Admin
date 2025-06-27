import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Pagination from "./Pagination";
import DeleteBook from "./DeleteBook";
import SkeletonTable from "./SkeletonTable";

export default function AllBooks({ activeUser }) {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "updatedAt", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedBookType, setSelectedBookType] = useState("");
  const allBookTypes = ["ebook", "both", "physical"];
  const [showModal, setShowModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const booksPerPage = 10;

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/book/fetchall`);
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
      (book.genre || "").toLowerCase().includes(search.toLowerCase()) ||
      (book.bookType || "").toLowerCase().includes(search.toLowerCase());
    const allBookTypes = ["ebook", "both", "physical"];
    const matchesGenre = selectedGenre ? book.genre === selectedGenre : true;
    const matchesAuthor = selectedAuthor ? book.author === selectedAuthor : true;
    const matchesBookType = selectedBookType
      ? allBookTypes.includes(book.bookType) && book.bookType === selectedBookType
      : true;
    return matchesSearch && matchesGenre && matchesAuthor && matchesBookType;
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
    if (book?.thumbnailCloudinary?.secure_url) {
      return <img src={book?.thumbnailCloudinary?.secure_url} alt="cover" className="w-8 h-12 sm:w-10 sm:h-14 object-cover rounded" />;
    } else if (book?.thumbnailURL) {
      return <img src={book?.thumbnailURL} alt="cover" className="w-8 h-12 sm:w-10 sm:h-14 object-cover rounded" />;
    }
    else {
      const fallbackText = (book?.title || "NA").substring(0, 2).toUpperCase();
      return (
        <div className="w-8 h-12 sm:w-10 sm:h-14 flex items-center justify-center bg-gray-300 text-xs sm:text-sm font-bold text-gray-700 rounded">
          {fallbackText}
        </div>
      );
    }
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setShowModal(true);
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
    <div className="p-3 sm:p-6 mb-14 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-semibold mb-1">
          Welcome, {activeUser.name}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
          Monitor all of your projects and tasks here
        </p>

        <div className="flex flex-col gap-4 mb-4 bg-white p-3 sm:p-4 rounded shadow">
          <h2 className="text-base sm:text-lg font-semibold mb-3">All Books</h2>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="w-full">
              <input
                type="text"
                placeholder="Search by title, author, or genre"
                className="w-full px-3 sm:px-4 py-2 border rounded shadow-sm text-sm sm:text-base"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Filters + Create Button */}
            <div className="flex flex-wrap gap-2 sm:gap-3 items-stretch">
              <select
                value={selectedAuthor}
                onChange={(e) => {
                  setSelectedAuthor(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2 sm:px-3 py-2 border rounded shadow-sm bg-white text-sm w-full sm:w-auto"
              >
                <option value="">All Authors</option>
                {allAuthors.map((author, i) => (
                  <option key={i} value={author}>
                    {author}
                  </option>
                ))}
              </select>

              <select
                value={selectedBookType}
                onChange={(e) => {
                  setSelectedBookType(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2 sm:px-3 py-2 border rounded shadow-sm bg-white text-sm w-full sm:w-auto"
              >
                <option value="">All Books</option>
                {allBookTypes.map((bookType, i) => (
                  <option key={i} value={bookType}>
                    {bookType}
                  </option>
                ))}
              </select>

              <select
                value={selectedGenre}
                onChange={(e) => {
                  setSelectedGenre(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2 sm:px-3 py-2 border rounded shadow-sm bg-white text-sm w-full sm:w-auto"
              >
                <option value="">Genre</option>
                {allGenres.map((genre, i) => (
                  <option key={i} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setSelectedAuthor("");
                  setSelectedBookType("");
                  setSelectedGenre("");
                  setSearch("");
                  setCurrentPage(1);
                }}
                className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm w-full sm:w-auto"
              >
                Clear Filters
              </button>

              <button
                disabled={!activeUser.isVerified}
                onClick={() => navigate("/createBook")}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-blue-700 text-white rounded flex items-center justify-center gap-2 transition-transform duration-200 text-sm"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Create a New Book</span>
                <span className="sm:hidden">New Book</span>
              </button>
            </div>
          </div>

          {/* Book Table */}
          {loading ? (
            <SkeletonTable />
          ) : currentBooks.length === 0 ? (
            <NoResultsFallback searchTerm={search} />
          ) : (
            <div className="overflow-x-auto rounded-md">
              <table className="w-full text-xs sm:text-sm text-left table-auto min-w-[600px]">
                <thead>
                  <tr className="text-gray-600 bg-[#F8F8FF] p-2">
                    <th
                      className="py-2 pl-2 w-[40%] cursor-pointer select-none"
                      onClick={() => handleSortClick("title")}
                    >
                      Book Title {renderSortArrow("title")}
                    </th>
                    <th className="w-[20%]">Genre</th>
                    <th
                      className="w-[20%] cursor-pointer select-none"
                      onClick={() => handleSortClick("updatedAt")}
                    >
                      <span>Date Updated</span>
                      {renderSortArrow("updatedAt")}
                    </th>
                    <th className="text-center w-[20%]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBooks.map((book) => (
                    <tr key={book._id} className="hover:bg-gray-50 transition">
                      <td
                        className="py-2 pl-2 cursor-pointer"
                        onClick={() => navigate(`/bookDetails/${book._id}`)}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {renderBookImageOrFallback(book)}
                          <div className="flex flex-col min-w-0">
                            <span className="truncate font-medium">
                              {book.title}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                              {book.author}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>{book.genre}</td>
                      <td className="text-xs sm:text-sm">
                        {formatDate(book.updatedAt)}
                      </td>
                      <td>
                        <div className="flex items-center justify-center gap-2 sm:gap-4">
                          <button
                            disabled={!activeUser.isVerified}
                            className="text-blue-700 hover:opacity-80 p-1"
                            onClick={() => navigate(`/update/${book._id}`)}
                            aria-label={`Edit ${book.title}`}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            disabled={!activeUser.isVerified}
                            className="text-red-700 hover:opacity-80 p-1"
                            onClick={() => handleDeleteClick(book)}
                            aria-label={`Delete ${book.title}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
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
            theme="dark"
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <DeleteBook setBookToDelete={setBookToDelete} bookToDelete={bookToDelete} setShowModal={setShowModal} setBooks={setBooks} />
      )}
    </div>
  );


}

function NoResultsFallback({ searchTerm }) {
  return (
    <div className="text-center py-6 sm:py-10 text-gray-600 text-base sm:text-lg">
      <div className="w-32 h-32 sm:w-auto sm:h-auto mx-auto">
        <DotLottieReact
          src="https://lottie.host/a0fce83e-dcda-4f6d-aeca-5bd3efe30c92/bc1GcXrliR.lottie"
          loop
          autoplay
        />
      </div>
      No results found for "<span className="font-semibold">{searchTerm}</span>"
    </div>
  );
}