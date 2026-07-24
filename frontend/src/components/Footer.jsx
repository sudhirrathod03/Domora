import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
        <p>© 2026 StayHub, Inc. All rights reserved.</p>

        <div className="space-x-4 mt-3">
          <Link
            to="/privacy"
            className="hover:text-[#E76F2E] transition-colors"
          >
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-[#E76F2E] transition-colors">
            Terms
          </Link>
          <Link
            to="/contact"
            className="hover:text-[#E76F2E] transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
