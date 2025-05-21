import { useState, useEffect, Fragment } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
                      <td className="py-2 pl-2 flex items-center gap-2 truncate">
                        {renderBookImageOrFallback(book)}
                        <a
                          href={book.pdfCloudinary || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate max-w-[300px] block"
                          title={book.title}
                        >
                          {book.title || "Untitled"}
                        </a>
                      </td>
                      <td className="truncate" title={book.author || "Unknown Author"}>
                        {book.author || "Unknown Author"}
                      </td>
                      <td className="truncate" title={book.genre || "Unspecified Genre"}>
                        {book.genre || "Unspecified Genre"}
                      </td>
                      <td>{formatDate(book.updatedAt)}</td>
                      <td>
                        <div className="flex gap-3">
                          <Pencil
                            size={16}
                            className="text-blue-600 cursor-pointer hover:scale-125 transition-transform"
                            onClick={() => navigate(`/update/${book._id}`)}
                          />
                          <Trash2
                            size={16}
                            className="text-red-600 cursor-pointer hover:scale-125 transition-transform"
                            onClick={() => handleDeleteClick(book)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && currentBooks.length > 0 && (
            <div className="flex justify-center mt-4 gap-2 flex-wrap">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-40 hover:cursor-pointer transition-transform duration-200"
              >
                Previous
              </button>
              {[...Array(totalPages).keys()].map((pageIndex) => (
                <button
                  key={pageIndex}
                  onClick={() => setCurrentPage(pageIndex + 1)}
                  className={`px-3 py-1 rounded hover:cursor-pointer transition-transform duration-200 ${currentPage === pageIndex + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  {pageIndex + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-40 hover:cursor-pointer transition-transform duration-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Delete confirmation modal */}
          <Transition appear show={showModal} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 z-10 overflow-y-auto"
              onClose={() => setShowModal(false)}
            >
              <div className="min-h-screen px-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                </Transition.Child>

                {/* Trick the browser into centering the modal contents. */}
                <span className="inline-block h-screen align-middle" aria-hidden="true">
                  &#8203;
                </span>

                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 "
                    >
                      Confirm Delete
                    </Dialog.Title>
                    <div className="mt-2">
                      <p>
                        Are you sure you want to delete the book{" "}
                        <strong>{bookToDelete?.title || "this book"}</strong>?
                      </p>
                    </div>

                    <div className="mt-4 flex justify-end gap-3">
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 hover:cursor-pointer transition-transform duration-200"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 hover:cursor-pointer transition-transform duration-200"
                        onClick={confirmDeleteBook}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton placeholder component
function SkeletonTable() {
  return (
    <div role="status" className="animate-pulse p-4">
      <div className="h-6 bg-gray-300 rounded w-1/4 mb-2" />
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}

// No results fallback with fade-in animation
function NoResultsFallback({ searchTerm }) {
  return (
    <div className="mt-6 p-6 text-center text-gray-500 text-lg animate-fade-in">
      {searchTerm ? (
        <>
          No results found for <span className="font-semibold">{searchTerm}</span>.
          <br />
          Try adjusting your search or filters.
        </>
      ) : (
        <>No books available.</>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in forwards;
        }
      `}</style>
    </div>
  );
}
