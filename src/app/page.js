"use client";

import Dashboard from "@/components/Dashboard";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

function MainApp() {
  const [isLogin, setIsLogin] = useState(true);
  const [activeUser, setActiveUser] = useState({});
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();

  const closeSidebar = () => setShowSidebar(false);

  return (
    <section className="bg-[#F8F8FF] min-h-screen flex flex-col md:flex-row relative overflow-x-hidden">
      {/* Hamburger Icon (Mobile) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 flex flex-col justify-between w-8 h-8 focus:outline-none"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <span
          className={`block h-1 w-full bg-black rounded transition-transform duration-300 ${
            showSidebar ? "rotate-45 translate-y-3" : ""
          }`}
        />
        <span
          className={`block h-1 w-full bg-black rounded transition-opacity duration-300 ${
            showSidebar ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`block h-1 w-full bg-black rounded transition-transform duration-300 ${
            showSidebar ? "-rotate-45 -translate-y-3" : ""
          }`}
        />
      </button>

      {/* Mobile Sidebar Backdrop */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Fixed Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-4/5 sm:w-2/3 md:w-1/5 bg-white z-50 transform transition-transform duration-300 ease-in-out
          ${showSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <Navbar
          setIsLogin={setIsLogin}
          setActiveUser={setActiveUser}
          activeUser={activeUser}
          closeSidebar={closeSidebar}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full md:ml-[20%] mt-16 md:mt-0 overflow-y-auto max-h-screen p-4">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Dashboard />} />
          {/* <Route path="/login" element={<Login setIsLogin={setIsLogin} />} /> */}
          {/* <Route path="/signup" element={<Signup />} /> */}
          {/* <Route path="/bookdetails/:id" element={<BookDetails />} /> */}
          {/* <Route path="/search" element={<SearchPage />} /> */}
          {/* <Route path="/profile" element={<Profile />} /> */}
          {/* <Route path="/uploadBook" element={<UploadBook />} /> */}
        </Routes>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}
