"use client";

import React, { useState, Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";

import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader"; // ⬅️ Import the spinner
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
    };
    document.title = titles[location.pathname] || "Library App";
  }, [location.pathname]);

  return (
    <section className="bg-[#F8F8FF] min-h-screen flex flex-col md:flex-row relative overflow-x-hidden">
      {/* Hamburger Icon */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 flex flex-col justify-between w-8 h-8 focus:outline-none"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <span className={`block h-1 w-full bg-black rounded transition-transform duration-300 ${showSidebar ? "rotate-45 translate-y-3" : ""}`} />
        <span className={`block h-1 w-full bg-black rounded transition-opacity duration-300 ${showSidebar ? "opacity-0" : "opacity-100"}`} />
        <span className={`block h-1 w-full bg-black rounded transition-transform duration-300 ${showSidebar ? "-rotate-45 -translate-y-3" : ""}`} />
      </button>

      {/* Backdrop */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40" onClick={closeSidebar} />
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
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
              <Route path="/all-users" element={<AnimatedPage><AllUsers /></AnimatedPage>} />
              <Route path="/all-books" element={<AnimatedPage><AllBooks /></AnimatedPage>} />
              <Route path="/borrow-requests" element={<AnimatedPage><BorrowRequests /></AnimatedPage>} />
              <Route path="/account-requests" element={<AnimatedPage><AccountRequests /></AnimatedPage>} />
              <Route path="/createBook" element={<AnimatedPage><CreateBook /></AnimatedPage>} />
              <Route path="/updateBook" element={<AnimatedPage><UpdateBook /></AnimatedPage>} />
              <Route path="/bookDetails" element={<AnimatedPage><BookDetails /></AnimatedPage>} />
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
