import React from 'react';
import { Link } from 'react-router-dom';

function Success() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Payment Successful!</h1>
      <p className="text-lg text-gray-700 mb-8">Your booking is confirmed.</p>
      <Link to="/" className="bg-[#C2185B] text-white px-6 py-2 rounded-lg font-bold">
        Back to Home
      </Link>
    </div>
  );
}
export default Success;