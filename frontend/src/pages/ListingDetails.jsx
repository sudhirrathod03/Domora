import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api.js';

function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function fetchListing() {
      try {
        const res = await api.get(`/listings/${id}`);
        setListing(res.data);
      } catch (error) {
        console.error("Error fetching listing details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="text-gray-500 text-lg">Listing not found.</div>
      </div>
    );
  }

  // FIXED: Changed listing.images to listing.image to match your Mongoose schema
  const images = listing.image || [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{listing.title}</h1>

      {/* Hero Image Carousel */}
      <div className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] rounded-2xl overflow-hidden mb-8 bg-gray-200 shadow-sm group">
        
        {/* Directly accessing the URL from the array object */}
        {images.length > 0 && (
          <img 
            src={images[currentImageIndex].url} 
            alt={`${listing.title} - view ${currentImageIndex + 1}`} 
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        )}

        {/* Only show next/prev buttons if there is more than 1 image */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 cursor-pointer -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 cursor-pointer  -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <div 
                  key={index} 
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                ></div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        
        {/* Description */}
        <div className="md:w-2/3">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About this space</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {listing.description}
          </p>
        </div>

        {/* Price Card */}
        <div className="md:w-1/3 w-full bg-white border border-gray-200 rounded-xl shadow-md p-6">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-gray-900">${listing.price}</span>
            <span className="text-gray-500">night</span>
          </div>
        </div>

      </div>
      
    </div>
  );
}

export default ListingDetails;