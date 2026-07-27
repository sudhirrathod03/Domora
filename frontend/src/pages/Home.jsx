import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import { Link } from "react-router-dom";
function Home() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await api.get("/listings");
        setListings(res.data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    }
    fetchListings();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {listings.map((listing) => (
         <Link to={`/listings/${listing._id}`} key={listing._id} className="group cursor-pointer block">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-200 mb-3">
              <img
                src={listing.image[0]?.url}
                alt={listing.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
              <button className="absolute cursor-pointer top-3 right-3 text-white hover:text-red-500 transition-colors">
                <svg
                  className="w-6 h-6 drop-shadow-md"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-900 truncate">
                {listing.title}
              </h3>
              <p className="text-gray-500 text-sm line-clamp-2 mt-1 mb-2">
                {listing.description}
              </p>
              <div className="mt-auto flex items-center space-x-1">
                <span className="font-semibold text-gray-900">
                  ${listing.price}
                </span>
                <span className="text-gray-900 text-sm">night</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
