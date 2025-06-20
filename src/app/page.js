"use client";
import React, { useState, Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";
import "./custom-cursor.css";
import { Toaster } from 'react-hot-toast';
import Loader from "@/components/Loader";
import BorrowRequests from "@/components/BorrowRequest";
import AccountRequests from "@/components/AccountRequest";
import UpdateBook from "@/components/UpdateBook";
import BookDetails from "@/components/BookDetails";
import LoginPage from "@/components/Login";
import Navbar from "@/components/Navbar";
import AdminSignup from "@/components/SignUp";
import { AlignJustify } from "lucide-react";
import BorrowHistory from "@/components/BorrowHistory";
import App from "./App";

const Dashboard = lazy(() => import("@/components/Dashboard"));
const AllUsers = lazy(() => import("@/components/AllUsers"));
const AllBooks = lazy(() => import("@/components/AllBooks"));
const CreateBook = lazy(() => import("@/components/CreateBook"));

const AnimatedPage = ({ children }) => (
  <motion.div
    className="w-full"
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

function MainApp() {
  const [isLogin, setIsLogin] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Enhanced fetchUser function using localStorage
  const fetchUser = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");

      if (!adminToken) {
        console.warn("No token found");
        setIsLogin(false);
        setActiveUser(null);
        setLoading(false);
        return { success: false, error: "No token found" };
      }

      const res = await fetch("http://localhost:4000/user", {
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

        // Clear invalid localStorage data
        localStorage.removeItem("activeUser");
        localStorage.removeItem("isLogin");
        localStorage.removeItem("token");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("userToken");

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
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("adminToken");
      if (token) {
        await fetchUser();
      } else {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

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
      cursor.classList.remove("custom-cursor--hover");
      if (link || button) {
        cursor.classList.add("custom-cursor--hover");
        if (soundUnlocked) {
          snapSound.currentTime = 0;
          snapSound.play().catch(() => { });
        }
      }
    };

    const handleMouseOut = () => {
      cursor.classList.remove("custom-cursor--hover");
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
    const savedCollapse = localStorage.getItem("sidebarCollapse");
    if (savedCollapse !== null) {
      setCollapse(savedCollapse === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarCollapse", collapse);
  }, [collapse]);

  const isLoginRoute = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/preLogin";
  const closeSidebar = () => setShowSidebar(false);

  const AuthPage = ({ children }) => !activeUser ? children : <Navigate to="/" replace />;

  const ProtectedPage = ({ children }) => {
    // If we're loading, show the loader
    if (loading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: '#F8F8FF'
        }}>
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
            className={`fixed top-0 left-0 h-screen bg-white z-40 shadow-lg hidden md:block overflow-hidden`}
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
    return <Navigate to="/preLogin" replace />;
  };

  return (
    <section className={`bg-[#F8F8FF] min-h-screen flex ${!isLoginRoute ? "md:flex-row" : "flex-col"} relative overflow-x-hidden`}>
      <div className="custom-cursor" />

      {/* Mobile Menu Button */}
      {!isLoginRoute && (
        <button
          className="md:hidden fixed top-4 left-4 z-50 flex flex-col justify-between w-8 h-8 focus:outline-none bg-white rounded-lg p-1 shadow-md transition-all duration-300"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <AlignJustify />
        </button>
      )}

      {/* Mobile Overlay */}
      {showSidebar && !isLoginRoute && (
        <div
          className="fixed inset-0 bg-gray-300 bg-opacity-70 backdrop-blur-2xl z-40 md:hidden"
          onClick={closeSidebar}
        >
          <AlignJustify />
        </div>
      )}

      {/* Main Content with margin animation */}
      <motion.main className={`flex-1 overflow-auto h-screen p-4 w-full transition-all duration-300 ${screenWidth < 768 ? "mt-8 ml-0" : isLoginRoute ? "ml-0" : collapse ? "ml-20" : "ml-60"}`}>
        <Suspense fallback={<Loader />}>
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route
                path="/preLogin"
                element={
                  <AnimatedPage>
                    <App
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
      </motion.main>
    </section>
  );
}

export default function Home() {
  return (
    <Tooltip.Provider>
      <Router>
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
        <MainApp />
      </Router>
    </Tooltip.Provider>
  );
}