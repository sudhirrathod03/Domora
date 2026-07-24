import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand / Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="text-[#E76F2E] font-bold text-2xl tracking-tight hover:scale-105 transition-transform duration-200"
            >
              StayHub
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              to="/"
              className="relative group text-gray-700 hover:text-gray-900 font-medium py-1 transition-colors"
            >
              Home
              <span className="absolute left-1/2 bottom-0 h-[2px] w-0 bg-[#E76F2E] -translate-x-1/2 transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </Link>

            <Link
              to="/experiences"
              className="relative group text-gray-700 hover:text-gray-900 font-medium py-1 transition-colors"
            >
              Experiences
              <span className="absolute left-1/2 bottom-0 h-[2px] w-0 bg-[#E76F2E] -translate-x-1/2 transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </Link>

            <Link
              to="/about"
              className="relative group text-gray-700 hover:text-gray-900 font-medium py-1 transition-colors"
            >
              About
              <span className="absolute left-1/2 bottom-0 h-[2px] w-0 bg-[#E76F2E] -translate-x-1/2 transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/login"
              className="relative group text-gray-700 hover:text-gray-900 font-semibold py-1 transition-colors"
            >
              Login
              <span className="absolute left-1/2 bottom-0 h-[2px] w-0 bg-[#E76F2E] -translate-x-1/2 transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </Link>

            <Link
              to="/signup"
              className="bg-[#E76F2E] text-white px-5 py-2 rounded-full font-semibold hover:bg-[#d65f24] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-[#E76F2E] focus:outline-none transition-colors"
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

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg absolute w-full pb-4">
          <div className="px-4 pt-2 space-y-1">
            <Link
              to="/"
              className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 hover:text-[#E76F2E] rounded-lg transition-colors"
            >
              Home
            </Link>
            <Link
              to="/experiences"
              className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 hover:text-[#E76F2E] rounded-lg transition-colors"
            >
              Experiences
            </Link>
            <Link
              to="/about"
              className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 hover:text-[#E76F2E] rounded-lg transition-colors"
            >
              About
            </Link>

            <div className="border-t border-gray-100 mt-2 pt-2 space-y-2">
              <Link
                to="/login"
                className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 hover:text-[#E76F2E] rounded-lg transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block text-center mx-4 py-3 text-white bg-[#E76F2E] rounded-lg font-medium hover:bg-[#d65f24] transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
