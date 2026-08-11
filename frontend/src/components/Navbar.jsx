import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    try {
      e.preventDefault();
      if (searchInput.trim()) {
        navigate(`/?search=${encodeURIComponent(searchInput.trim())}`);
      } else {

        navigate(`/`);
      }
    } catch (error) {}
  };
  return (
    <nav className="sticky top-4 z-50 mx-auto w-[92%] max-w-7xl rounded-full bg-white/80 backdrop-blur-lg border border-gray-200 shadow-md transition-all duration-300">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand / Logo */}
          <div className="flex-shrink-0 flex items-center pl-2">
            <Link
              to="/"
              className="text-[#C2185B] font-extrabold text-2xl tracking-tight hover:scale-105 transition-transform duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                className="w-10 h-10 text-[#C2185B] hover:scale-105 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Main Roof and Walls */}
                <path d="M 50 15 L 12 45 V 82 C 12 85.3 14.7 88 18 88 H 82 C 85.3 88 88 85.3 88 82 V 45 Z" />
                {/* Rounded Archway Door */}
                <path d="M 35 88 V 60 C 35 52 41 47 50 47 C 59 47 65 52 65 60 V 88" />
                {/* Top Window Accent */}
                <circle
                  cx="50"
                  cy="32"
                  r="4"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </Link>
          </div>
          <form 
            onSubmit={handleSearch} 
            className="hidden md:flex items-center border border-gray-300 rounded-full py-2 px-4 shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="outline-none bg-transparent w-48 lg:w-64 text-sm text-gray-700 placeholder-gray-500 font-medium"
            />
            <button 
              type="submit" 
              className="bg-[#C2185B] text-white p-2 rounded-full ml-2 hover:bg-[#a3124b] transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </form>
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-1 items-center">
            <Link
              to="/"
              className="text-gray-700 hover:text-[#C2185B] font-medium px-4 py-2 rounded-full hover:bg-gray-100 transition-all duration-300"
            >
              Home
            </Link>

            {user && (
              <Link
                to="/listings/new"
                className="text-gray-700 hover:text-[#C2185B] font-medium px-4 py-2 rounded-full hover:bg-gray-100 transition-all duration-300"
              >
                Add listing
              </Link>
            )}

            <Link
              to="/trips"
              className="text-gray-700 hover:text-[#C2185B] font-medium px-4 py-2 rounded-full hover:bg-gray-100 transition-all duration-300"
            >
              Trips
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3 pr-2">
            {user ? (
              <div className="flex items-center space-x-3 bg-gray-50 pl-4 pr-1.5 py-1.5 rounded-full border border-gray-200 shadow-sm">
                <span className="text-gray-700 font-medium text-sm">
                  Hi,{" "}
                  <span className="font-bold text-[#C2185B]">{user.name}</span>
                </span>
                <button
                  onClick={logout}
                  className="bg-white hover:bg-gray-100 text-gray-600 hover:text-[#C2185B] text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm border border-gray-100 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-[#C2185B] font-semibold px-4 py-2 rounded-full hover:bg-gray-100 transition-all duration-300"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="bg-[#C2185B] text-white px-6 py-2 rounded-full font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center pr-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-[#C2185B] focus:outline-none transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Mobile Menu Card */}
      <div
        // THE FIX: Changed mobile dropdown bg to white/95 for better contrast against the body
        className={`md:hidden absolute top-[110%] left-0 w-full bg-white/95 backdrop-blur-xl border border-gray-200 shadow-xl rounded-2xl transition-all duration-300 ease-in-out origin-top overflow-hidden ${
          isMobileMenuOpen
            ? "opacity-100 scale-y-100"
            : "opacity-0 scale-y-0 pointer-events-none"
        }`}
      >
        <div className="p-3 space-y-1">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 hover:text-[#C2185B] rounded-xl transition-colors"
          >
            Home
          </Link>

          {user && (
            <Link
              to="/listings/new"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 hover:text-[#C2185B] rounded-xl transition-colors"
            >
              Add listing
            </Link>
          )}

          <Link
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 hover:text-[#C2185B] rounded-xl transition-colors"
          >
            About
          </Link>

          <div className="border-t border-gray-100 mt-2 pt-2">
            {user ? (
              <div className="p-4 bg-gray-50 rounded-xl mt-2 border border-gray-100">
                <p className="text-gray-600 font-medium mb-3 text-center">
                  Logged in as{" "}
                  <span className="text-[#C2185B]">{user.name}</span>
                </p>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-[#C2185B] font-bold bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-[#C2185B] hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 hover:text-[#C2185B] rounded-xl transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center mx-2 py-3 text-white bg-[#C2185B] rounded-xl font-medium shadow-md hover:bg-[#9c1349] transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
