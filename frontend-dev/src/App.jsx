import { useState, Suspense, lazy, useEffect, useCallback } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";
import "./custom-cursor.css";
import { Toaster } from 'react-hot-toast';
import Loader from "./components/Loader";
import BorrowRequests from "./components/BorrowRequest";
import AccountRequests from "./components/AccountRequest";
import UpdateBook from "./components/UpdateBook";
import BookDetails from "./components/BookDetails";
import LoginPage from "./components/Login";
import Navbar from "./components/Navbar";
import AdminSignup from "./components/SignUp";
import { AlignJustify } from "lucide-react";
import BorrowHistory from "./components/BorrowHistory";
import Page from "./Page";
import Cookies from 'js-cookie'

const Dashboard = lazy(() => import("./components/Dashboard"));
const AllUsers = lazy(() => import("./components/AllUsers"));
const AllBooks = lazy(() => import("./components/AllBooks"));
const CreateBook = lazy(() => import("./components/CreateBook"));

const AnimatedPage = ({ children }) => (
    <motion.div
        className="w-full h-full"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
    >
        {children}
    </motion.div>
);

function App() {
    const [isLogin, setIsLogin] = useState(false);
    const [activeUser, setActiveUser] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [collapse, setCollapse] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    // Enhanced fetchUser function using Cookies
    const fetchUser = useCallback(async () => {
        try {
            const adminToken = Cookies.get("adminToken");

            if (!adminToken) {
                console.warn("No token found");
                setIsLogin(false);
                setActiveUser(null);
                setLoading(false);
                return { success: false, error: "No token found" };
            }

            const res = await fetch(`${SERVER_URL}/user`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": adminToken,
                },
            });

            const json = await res.json();

            if (res.ok && json) {
                const userData = json.user || json;
                setActiveUser(userData);
                setIsLogin(true);
                return { success: true, user: userData };
            } else {
                console.error("Failed to fetch user:", json?.error);
                setIsLogin(false);
                setActiveUser(null);

                // Clear invalid Cookies data
                Cookies.remove("activeUser");
                Cookies.remove("isLogin");
                Cookies.remove("token");
                Cookies.remove("adminToken");
                Cookies.remove("userToken");

                return { success: false, error: json?.error || "Failed to fetch user" };
            }
        } catch (err) {
            console.error("Error fetching user:", err);
            setIsLogin(false);
            setActiveUser(null);
            return { success: false, error: "Network error" };
        } finally {
            setLoading(false);
        }
    }, [SERVER_URL])

    useEffect(() => {
        const initAuth = async () => {
            const token = Cookies.get("adminToken");
            if (token) {
                await fetchUser();
            } else {
                setLoading(false);
            }
        };
        initAuth();
    }, [fetchUser]);

    // Custom cursor + sound logic
    useEffect(() => {
        const cursor = document.querySelector(".custom-cursor");
        const snapSound = new Audio("/sound1.wav");
        let soundUnlocked = false;

        const unlockSound = () => {
            if (!soundUnlocked) {
                snapSound.play().catch(() => { });
                snapSound.pause();
                snapSound.currentTime = 0;
                soundUnlocked = true;
            }
        };

        document.addEventListener("click", unlockSound, { once: true });
        document.addEventListener("keydown", unlockSound, { once: true });

        let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0;
        const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

        const animateCursor = () => {
            currentX = lerp(currentX, mouseX, 0.3);
            currentY = lerp(currentY, mouseY, 0.3);
            cursor.style.left = `${currentX}px`;
            cursor.style.top = `${currentY}px`;
            requestAnimationFrame(animateCursor);
        };

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.classList.add("custom-cursor--init");
        };

        const handleMouseOver = (e) => {
            const link = e.target.closest("a");
            const button = e.target.closest("button");

            cursor.classList.remove("custom-cursor--hover", "custom-cursor--disabled");

            if (button) {
                if (button.disabled) {
                    cursor.classList.add("custom-cursor--disabled");
                } else {
                    cursor.classList.add("custom-cursor--hover");
                    if (soundUnlocked) {
                        snapSound.currentTime = 0;
                        snapSound.play().catch(() => { });
                    }
                }
            } else if (link) {
                cursor.classList.add("custom-cursor--hover");
                if (soundUnlocked) {
                    snapSound.currentTime = 0;
                    snapSound.play().catch(() => { });
                }
            }
        };

        const handleMouseOut = () => {
            cursor.classList.remove("custom-cursor--hover", "custom-cursor--disabled");
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseout", handleMouseOut);

        animateCursor();

        return () => {
            document.removeEventListener("click", unlockSound);
            document.removeEventListener("keydown", unlockSound);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseout", handleMouseOut);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const titles = {
            "/": "BookWise App - Dashboard",
            "/all-users": "BookWise App - All Users",
            "/all-books": "BookWise App - All Books",
            "/borrow-requests": "BookWise App - Borrow Requests",
            "/account-requests": "BookWise App - Account Requests",
            "/createBook": "BookWise App - Create Book",
            "/borrowHistory": "BookWise App - Borrow History",
            "/preLogin": "BookWise App - Authentication",
        };
        document.title = titles[location.pathname] || "BookWise App";
    }, [location.pathname]);

    useEffect(() => {
        const savedCollapse = Cookies.get("sidebarCollapse");
        if (savedCollapse !== null) {
            setCollapse(savedCollapse === "true");
        }
    }, []);

    useEffect(() => {
        Cookies.set("sidebarCollapse", collapse);
    }, [collapse]);

    const isLoginRoute = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/preLogin";
    const closeSidebar = () => setShowSidebar(false);

    const AuthPage = ({ children }) => {
        if (loading) {
            return (
                <div className="flex justify-center items-center min-h-screen w-full bg-[#F8F8FF]">
                    <Loader />
                </div>
            );
        }
        return !activeUser ? children : <Navigate to="/" replace />;
    };

    const ProtectedPage = ({ children }) => {
        // If we're loading, show the loader
        if (loading) {
            return (
                <div className="flex justify-center items-center min-h-screen w-full bg-[#F8F8FF]">
                    <Loader />
                </div>
            );
        }

        // If user is authenticated, show the protected content
        if (activeUser) {
            return (
                <>
                    {/* Desktop Sidebar with Motion */}
                    <motion.div
                        initial={false}
                        animate={{
                            width: collapse ? "4.59rem" : "15rem",
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed top-0 left-0 h-screen bg-white z-40 shadow-lg hidden md:block overflow-hidden"
                    >
                        <Navbar
                            setIsLogin={setIsLogin}
                            setActiveUser={setActiveUser}
                            activeUser={activeUser}
                            closeSidebar={closeSidebar}
                            setCollapse={setCollapse}
                            collapse={collapse}
                        />
                    </motion.div>

                    {/* Mobile Sidebar */}
                    <AnimatePresence>
                        {showSidebar && (
                            <motion.div
                                key="mobile-sidebar"
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="fixed top-0 left-0 h-screen bg-white z-50 shadow-lg md:hidden w-4/5 max-w-sm"
                            >
                                <Navbar
                                    setIsLogin={setIsLogin}
                                    setActiveUser={setActiveUser}
                                    activeUser={activeUser}
                                    closeSidebar={closeSidebar}
                                    setCollapse={setCollapse}
                                    collapse={false}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {children}
                </>
            );
        }

        // If not authenticated, redirect to login
        return <Navigate to="/login" replace />;
    };

    return (
        <Tooltip.Provider>
            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                }}
            />
            <section className="bg-[#F8F8FF] min-h-screen w-full flex relative overflow-hidden">
                <div className="custom-cursor" />

                {/* Mobile Menu Button */}
                {!isLoginRoute && (
                    <button
                        className="md:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-10 h-10 focus:outline-none bg-white rounded-lg shadow-md transition-all duration-300"
                        onClick={() => setShowSidebar(!showSidebar)}
                    >
                        <AlignJustify size={20} />
                    </button>
                )}

                {/* Mobile Overlay */}
                {showSidebar && !isLoginRoute && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 md:hidden"
                        onClick={closeSidebar}
                    />
                )}

                {/* Main Content with proper margins */}
                <motion.main
                    className={`flex-1 h-screen overflow-auto transition-all duration-300 ease-in-out ${isLoginRoute
                            ? "w-full"
                            : screenWidth >= 768
                                ? collapse
                                    ? "ml-[4.59rem]"
                                    : "ml-60"
                                : "w-full"
                        }`}
                >
                    <div className={`w-full h-full ${isLoginRoute ? "p-0" : "p-4 md:p-6"} ${!isLoginRoute && screenWidth < 768 ? "pt-16" : ""}`}>
                        <Suspense fallback={
                            <div className="flex justify-center items-center min-h-[50vh] w-full">
                                <Loader />
                            </div>
                        }>
                            <AnimatePresence mode="wait" initial={false}>
                                <Routes location={location} key={location.pathname}>
                                    <Route
                                        path="/preLogin"
                                        element={
                                            <AnimatedPage>
                                                <Page
                                                    activeUser={activeUser}
                                                    setActiveUser={setActiveUser}
                                                    setIsLogin={setIsLogin}
                                                />
                                            </AnimatedPage>
                                        }
                                    />
                                    <Route
                                        path="/"
                                        element={
                                            <ProtectedPage>
                                                <AnimatedPage>
                                                    <Dashboard activeUser={activeUser} />
                                                </AnimatedPage>
                                            </ProtectedPage>
                                        }
                                    />
                                    <Route
                                        path="/all-users"
                                        element={
                                            <ProtectedPage>
                                                <AnimatedPage>
                                                    <AllUsers activeUser={activeUser} />
                                                </AnimatedPage>
                                            </ProtectedPage>
                                        }
                                    />
                                    <Route
                                        path="/all-books"
                                        element={
                                            <ProtectedPage>
                                                <AnimatedPage>
                                                    <AllBooks activeUser={activeUser} />
                                                </AnimatedPage>
                                            </ProtectedPage>
                                        }
                                    />
                                    <Route
                                        path="/borrow-requests"
                                        element={
                                            <ProtectedPage>
                                                <AnimatedPage>
                                                    <BorrowRequests activeUser={activeUser} />
                                                </AnimatedPage>
                                            </ProtectedPage>
                                        }
                                    />
                                    <Route
                                        path="/borrowHistory"
                                        element={
                                            <ProtectedPage>
                                                <AnimatedPage>
                                                    <BorrowHistory activeUser={activeUser} />
                                                </AnimatedPage>
                                            </ProtectedPage>
                                        }
                                    />
                                    <Route
                                        path="/account-requests"
                                        element={
                                            <ProtectedPage>
                                                <AnimatedPage>
                                                    <AccountRequests activeUser={activeUser} />
                                                </AnimatedPage>
                                            </ProtectedPage>
                                        }
                                    />
                                    <Route
                                        path="/createBook"
                                        element={
                                            <ProtectedPage>
                                                <AnimatedPage>
                                                    <CreateBook activeUser={activeUser} />
                                                </AnimatedPage>
                                            </ProtectedPage>
                                        }
                                    />
                                    <Route
                                        path="/update/:bookId"
                                        element={
                                            <ProtectedPage>
                                                <AnimatedPage>
                                                    <UpdateBook />
                                                </AnimatedPage>
                                            </ProtectedPage>
                                        }
                                    />
                                    <Route
                                        path="/bookDetails/:bookId"
                                        element={
                                            <ProtectedPage>
                                                <AnimatedPage>
                                                    <BookDetails activeUser={activeUser} />
                                                </AnimatedPage>
                                            </ProtectedPage>
                                        }
                                    />
                                    <Route
                                        path="/login"
                                        element={
                                            <AuthPage>
                                                <AnimatedPage>
                                                    <LoginPage
                                                        setIsLogin={setIsLogin}
                                                        setActiveUser={setActiveUser}
                                                    />
                                                </AnimatedPage>
                                            </AuthPage>
                                        }
                                    />
                                    <Route
                                        path="/signup"
                                        element={
                                            <AuthPage>
                                                <AnimatedPage>
                                                    <AdminSignup />
                                                </AnimatedPage>
                                            </AuthPage>
                                        }
                                    />
                                </Routes>
                            </AnimatePresence>
                        </Suspense>
                    </div>
                </motion.main>
            </section>
        </Tooltip.Provider>
    );
}

export default App;