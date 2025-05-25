"use client";

import React, { useState, Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";
import './custom-cursor.css';

import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import BorrowRequests from "@/components/BorrowRequest";
import AccountRequests from "@/components/AccountRequest";
import UpdateBook from "@/components/UpdateBook";
import BookDetails from "@/components/BookDetails";

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
  const [isLogin, setIsLogin] = useState(true);
  const [activeUser, setActiveUser] = useState({});
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();

  const closeSidebar = () => setShowSidebar(false);

  useEffect(() => {
    const titles = {
      "/": "Dashboard",
      "/all-users": "All Users",
      "/all-books": "All Books",
      "/borrow-requests": "Borrow Requests",
      "/account-requests": "Account Requests",
      "/createBook": "Create Book",
    };
    document.title = titles[location.pathname] || "Library App";
  }, [location.pathname]);

  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor');
    const snapSound = new Audio('/sound1.wav');

    let soundUnlocked = false;

    const unlockSound = () => {
      if (!soundUnlocked) {
        snapSound.play().catch(() => { }); // try to play silently
        snapSound.pause();
        snapSound.currentTime = 0;
        soundUnlocked = true;
      }
    };

    // Attach unlock logic on first click or keypress
    document.addEventListener('click', unlockSound, { once: true });
    document.addEventListener('keydown', unlockSound, { once: true });

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

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
      cursor.classList.add('custom-cursor--init');
    };

    const handleMouseOver = (e) => {
      const link = e.target.closest('a');
      const button = e.target.closest('button');

      cursor.classList.remove('custom-cursor--hover');

      if (link || button) {
        cursor.classList.add('custom-cursor--hover');

        if (soundUnlocked) {
          snapSound.currentTime = 0;
          snapSound.play().catch(() => { });
        }
      }
    };

    const handleMouseOut = () => {
      cursor.classList.remove('custom-cursor--hover');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    animateCursor();

    return () => {
      document.removeEventListener('click', unlockSound);
      document.removeEventListener('keydown', unlockSound);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);


  return (
    <section className="bg-[#F8F8FF] min-h-screen flex flex-col md:flex-row relative overflow-x-hidden">
      {/* Custom Cursor */}
      <div className="custom-cursor" />

      {/* Hamburger Icon */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 flex flex-col justify-between w-8 h-8 focus:outline-none"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <span
          className={`block h-1 w-full bg-black rounded transition-transform duration-300 ${showSidebar ? "rotate-45 translate-y-3" : ""
            }`}
        />
        <span
          className={`block h-1 w-full bg-black rounded transition-opacity duration-300 ${showSidebar ? "opacity-0" : "opacity-100"
            }`}
        />
        <span
          className={`block h-1 w-full bg-black rounded transition-transform duration-300 ${showSidebar ? "-rotate-45 -translate-y-3" : ""
            }`}
        />
      </button>

      {/* Backdrop */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-4/5 sm:w-2/3 md:w-1/5 bg-white z-50 transform transition-transform duration-300 ease-in-out 
        ${showSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:block`}
      >
        <Navbar
          setIsLogin={setIsLogin}
          setActiveUser={setActiveUser}
          activeUser={activeUser}
          closeSidebar={closeSidebar}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full md:ml-[20%] mt-16 md:mt-0 overflow-auto max-h-screen p-4">
        <Suspense fallback={<Loader />}>
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={<AnimatedPage><Dashboard /></AnimatedPage>}
              />
              <Route
                path="/all-users"
                element={<AnimatedPage><AllUsers /></AnimatedPage>}
              />
              <Route
                path="/all-books"
                element={<AnimatedPage><AllBooks /></AnimatedPage>}
              />
              <Route
                path="/borrow-requests"
                element={<AnimatedPage><BorrowRequests /></AnimatedPage>}
              />
              <Route
                path="/account-requests"
                element={<AnimatedPage><AccountRequests /></AnimatedPage>}
              />
              <Route
                path="/createBook"
                element={<AnimatedPage><CreateBook /></AnimatedPage>}
              />
              <Route
                path="/update/:bookId"
                element={<AnimatedPage><UpdateBook /></AnimatedPage>}
              />
              <Route
                path="/bookDetails/:bookId"
                element={<AnimatedPage><BookDetails /></AnimatedPage>}
              />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
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
