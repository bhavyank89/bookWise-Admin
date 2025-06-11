"use client";

import React, { useState, Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";
import './custom-cursor.css';

import Loader from "@/components/Loader";
import BorrowRequests from "@/components/BorrowRequest";
import AccountRequests from "@/components/AccountRequest";
import UpdateBook from "@/components/UpdateBook";
import BookDetails from "@/components/BookDetails";
import LoginPage from "@/components/Login";
import Navbar from "@/components/Navbar";
import AdminSignup from "@/components/SignUp";

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
  const location = useLocation();

  const closeSidebar = () => setShowSidebar(false);

  const isLoginRoute = location.pathname === "/login";

  const AuthPage = ({ children }) => (
    !activeUser ? children : <Navigate to="/" replace />
  );

  const ProtectedPage = ({ children }) => (
    activeUser ? (
      <>
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
        {children}
      </>
    ) : <Navigate to="/login" replace />
  );

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
        snapSound.play().catch(() => { });
        snapSound.pause();
        snapSound.currentTime = 0;
        soundUnlocked = true;
      }
    };

    document.addEventListener('click', unlockSound, { once: true });
    document.addEventListener('keydown', unlockSound, { once: true });

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
    <section className={`bg-[#F8F8FF] min-h-screen flex ${!isLoginRoute ? "md:flex-row" : "flex-col"} relative overflow-x-hidden`}>
      <div className="custom-cursor" />

      {!isLoginRoute && (
        <button
          className="md:hidden fixed top-4 left-4 z-50 flex flex-col justify-between w-8 h-8 focus:outline-none"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <span className={`block h-1 w-full bg-black rounded transition-transform duration-300 ${showSidebar ? "rotate-45 translate-y-3" : ""}`} />
          <span className={`block h-1 w-full bg-black rounded transition-opacity duration-300 ${showSidebar ? "opacity-0" : "opacity-100"}`} />
          <span className={`block h-1 w-full bg-black rounded transition-transform duration-300 ${showSidebar ? "-rotate-45 -translate-y-3" : ""}`} />
        </button>
      )}

      {showSidebar && !isLoginRoute && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
          onClick={closeSidebar}
        />
      )}

      <main className={`flex-1 w-full ${!isLoginRoute && activeUser ? "md:ml-[20%]" : "mt-0"} overflow-auto h-full p-4`}>
        <Suspense fallback={<Loader />}>
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<ProtectedPage><AnimatedPage><Dashboard /></AnimatedPage></ProtectedPage>} />
              <Route path="/all-users" element={<ProtectedPage><AnimatedPage><AllUsers /></AnimatedPage></ProtectedPage>} />
              <Route path="/all-books" element={<ProtectedPage><AnimatedPage><AllBooks /></AnimatedPage></ProtectedPage>} />
              <Route path="/borrow-requests" element={<ProtectedPage><AnimatedPage><BorrowRequests /></AnimatedPage></ProtectedPage>} />
              <Route path="/account-requests" element={<ProtectedPage><AnimatedPage><AccountRequests /></AnimatedPage></ProtectedPage>} />
              <Route path="/createBook" element={<ProtectedPage><AnimatedPage><CreateBook /></AnimatedPage></ProtectedPage>} />
              <Route path="/update/:bookId" element={<ProtectedPage><AnimatedPage><UpdateBook /></AnimatedPage></ProtectedPage>} />
              <Route path="/bookDetails/:bookId" element={<ProtectedPage><AnimatedPage><BookDetails /></AnimatedPage></ProtectedPage>} />
              <Route path="/login" element={<AuthPage><AnimatedPage><LoginPage  setIsLogin={setIsLogin} setActiveUser={setActiveUser} /></AnimatedPage></AuthPage>} />
              <Route path="/signup" element={<AuthPage><AnimatedPage><AdminSignup /></AnimatedPage></AuthPage>} />
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
