"use client";
import React, { useState, Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";
import "./custom-cursor.css";

import Loader from "@/components/Loader";
import BorrowRequests from "@/components/BorrowRequest";
import AccountRequests from "@/components/AccountRequest";
import UpdateBook from "@/components/UpdateBook";
import BookDetails from "@/components/BookDetails";
import LoginPage from "@/components/Login";
import Navbar from "@/components/Navbar";
import AdminSignup from "@/components/SignUp";
import { AlignJustify } from "lucide-react";

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

const userData = {
  _id: "68497655446f53423c6443da",
  name: "envy2",
  email: "envy2@gmail.com",
  role: "Admin",
  isVerified: false,
  avatar: [],
  books: [],
  savedBooks: [],
  createdAt: "2025-06-11T12:28:05.499Z",
  updatedAt: "2025-06-11T12:28:05.499Z",
  totalBorrowed: 0,
  overdueCount: 0,
  totalSavedBooks: 0,
  id: "68497655446f53423c6443da",
};

function MainApp() {
  const [isLogin, setIsLogin] = useState(true);
  const [activeUser, setActiveUser] = useState(userData);
  const [showSidebar, setShowSidebar] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const location = useLocation();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // custom cursor + sound logic — unchanged
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

    let mouseX = 0,
      mouseY = 0,
      currentX = 0,
      currentY = 0;
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

  const isLoginRoute =
    location.pathname === "/login" || location.pathname === "/signup";

  const closeSidebar = () => setShowSidebar(false);

  const AuthPage = ({ children }) =>
    !activeUser ? children : <Navigate to="/" replace />;

  const ProtectedPage = ({ children }) =>
    activeUser ? (
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
    ) : (
      <Navigate to="/login" replace />
    );

  return (
    <section className={`bg-[#F8F8FF] min-h-screen flex ${!isLoginRoute ? "md:flex-row" : "flex-col"} relative overflow-x-hidden`}>

      <div className="custom-cursor" />

      {/* Mobile Menu Button */}
      {!isLoginRoute && (
        <button className="md:hidden fixed top-4 left-4 z-50 flex flex-col justify-between w-8 h-8 focus:outline-none bg-white rounded-lg p-1 shadow-md transition-all duration-300" onClick={() => setShowSidebar(!showSidebar)}>
          <AlignJustify />
        </button>
      )}

      {/* Mobile Overlay */}
      {showSidebar && !isLoginRoute && (
        <div
          className="fixed inset-0 bg-gray-300 bg-opacity-70 backdrop-blur-2xl z-40 md:hidden"
          onClick={closeSidebar}
        ><AlignJustify /></div>
      )}

      {/* Main Content with margin animation */}
      <motion.main className={`flex-1 overflow-auto h-screen p-4 w-full transition-all duration-300 ${screenWidth < 768 ? "mt-8 ml-0" : isLoginRoute ? "ml-0" : collapse ? "ml-20" : "ml-60"}`}>
        <Suspense fallback={<Loader />}>
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<ProtectedPage><AnimatedPage><Dashboard activeUser={activeUser} /></AnimatedPage></ProtectedPage>} />
              <Route path="/all-users" element={<ProtectedPage><AnimatedPage><AllUsers activeUser={activeUser} /></AnimatedPage></ProtectedPage>} />
              <Route path="/all-books"
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
        <MainApp />
      </Router>
    </Tooltip.Provider>
  );
}
