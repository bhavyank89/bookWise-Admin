import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';

const booksData = [
    {
        id: 1,
        title: "The Great Reclamation: A Novel by",
        author: "Rachel Hxeng",
        genre: "Strategic, Fantasy",
        date: "Dec 19 2023",
        image: "https://via.placeholder.com/40x60?text=Book1",
    },
    {
        id: 2,
        title: "Inside Evil: Inside Evil Series, Book 1",
        author: "Rachel Heng",
        genre: "Strategic, Fantasy",
        date: "Dec 19 2023",
        image: "https://via.placeholder.com/40x60?text=Book2",
    },
    {
        id: 3,
        title: "Jayne Castle - People in Glass Houses",
        author: "Rachel Heng",
        genre: "Strategic, Fantasy",
        date: "Dec 19 2023",
        image: "https://via.placeholder.com/40x60?text=Book3",
    },
    // Add more books to simulate a larger dataset
    {
        id: 4,
        title: "Book 4",
        author: "Author 4",
        genre: "Genre 4",
        date: "Dec 19 2023",
        image: "https://via.placeholder.com/40x60?text=Book4",
    },
    {
        id: 5,
        title: "Book 5",
        author: "Author 5",
        genre: "Genre 5",
        date: "Dec 19 2023",
        image: "https://via.placeholder.com/40x60?text=Book5",
    },
    {
        id: 6,
        title: "Book 6",
        author: "Author 6",
        genre: "Genre 6",
        date: "Dec 19 2023",
        image: "https://via.placeholder.com/40x60?text=Book6",
    },
];

export default function AllBooks() {
    const [search, setSearch] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 3;

    useEffect(() => {
        setLoading(true);
        // Simulate data fetching delay
        const timer = setTimeout(() => {
            setBooks(booksData);
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const filteredBooks = books.filter((book) => {
        const searchTerm = search.toLowerCase();
        return (
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.genre.toLowerCase().includes(searchTerm)
        );
    });

    const handleSort = () => {
        const sortedBooks = [...books].sort((a, b) => {
            return sortOrder === 'asc'
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title);
        });
        setBooks(sortedBooks);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-semibold mb-1">Welcome, Adrian</h1>
                <p className="text-sm text-gray-500 mb-6">Monitor all of your projects and tasks here</p>

                <div className="flex items-center justify-between mb-4">
                    <input
                        type="text"
                        placeholder="Search users, books by title, author, or genre."
                        className="w-1/2 px-4 py-2 border rounded shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleSort}
                            className="px-3 py-2 border rounded shadow-sm text-sm">
                            A-Z {sortOrder === 'asc' ? '↓' : '↑'}
                        </button>
                        <button className="px-4 py-2 bg-blue-700 text-white rounded flex items-center gap-2">
                            <Plus size={16} /> Create a New Book
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded shadow p-4">
                    <h2 className="text-lg font-bold mb-4">All Books</h2>

                    {loading ? (
                        // Loading skeletons
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-gray-600 bg-[#F8F8FF]">
                                    <th className="py-2 pl-2">Book Title</th>
                                    <th>Author</th>
                                    <th>Genre</th>
                                    <th>Date Created</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(3)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="py-2 pl-2 flex items-center gap-2">
                                            <div className="w-10 h-14 bg-gray-200 rounded" />
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        </td>
                                        <td><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                                        <td><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                                        <td><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                                        <td>
                                            <div className="flex gap-2">
                                                <div className="w-4 h-4 bg-gray-200 rounded-full" />
                                                <div className="w-4 h-4 bg-gray-200 rounded-full" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <>
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="text-gray-600 bg-[#F8F8FF] p-2">
                                        <th className="py-2 pl-2">Book Title</th>
                                        <th>Author</th>
                                        <th>Genre</th>
                                        <th>Date Created</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentBooks.map((book, i) => (
                                        <tr key={i} className="transition-all duration-300 hover:bg-gray-50">
                                            <td className="py-2 pl-2 flex items-center gap-2">
                                                <img src={book.image} alt="cover" className="w-10 h-14 object-cover rounded" />
                                                <span>{book.title}</span>
                                            </td>
                                            <td>{book.author}</td>
                                            <td>{book.genre}</td>
                                            <td>{book.date}</td>
                                            <td>
                                                <div className="flex gap-3">
                                                    <Pencil size={16} className="text-blue-600 cursor-pointer hover:scale-125 transition-transform" />
                                                    <Trash2 size={16} className="text-red-600 cursor-pointer hover:scale-125 transition-transform" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            <div className="flex justify-center mt-4 gap-2">
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => handlePageChange(index + 1)}
                                        className={`px-4 py-2 border rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
