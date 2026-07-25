import React from "react";

// 1. Dummy Data for Properties
const properties = [
  {
    id: 1,
    location: "Bali, Indonesia",
    distance: "4,500 kilometers away",
    dates: "Oct 15 - 20",
    price: "$120",
    rating: "4.92",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    location: "Santorini, Greece",
    distance: "7,100 kilometers away",
    dates: "Nov 2 - 9",
    price: "$250",
    rating: "4.98",
    image: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    location: "Aspen, Colorado",
    distance: "2,000 kilometers away",
    dates: "Dec 10 - 15",
    price: "$340",
    rating: "4.85",
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    location: "Tulum, Mexico",
    distance: "1,200 kilometers away",
    dates: "Jan 5 - 12",
    price: "$180",
    rating: "4.79",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  }
];

// 2. Dummy Data for Categories
const categories = ["Trending", "Beachfront", "Cabins", "Amazing Pools", "Mansions", "Lakefront", "Design"];

function Home() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Category Navigation */}
      <div className="flex space-x-8 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {categories.map((category, index) => (
          <button 
            key={index}
            className={`whitespace-nowrap pb-2 border-b-2 text-sm font-medium transition-colors ${
              index === 0 
                ? "border-[#E76F2E] text-gray-900" // Active state
                : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="group cursor-pointer">
            
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-200 mb-3">
              <img 
                src={property.image} 
                alt={property.location} 
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
              {/* Favorite Heart Icon */}
              <button className="absolute top-3 right-3 text-white hover:text-red-500 transition-colors">
                <svg className="w-6 h-6 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </button>
            </div>

            {/* Property Info */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{property.location}</h3>
                <p className="text-gray-500 text-sm">{property.distance}</p>
                <p className="text-gray-500 text-sm">{property.dates}</p>
                <div className="mt-1 flex items-center space-x-1">
                  <span className="font-semibold text-gray-900">{property.price}</span>
                  <span className="text-gray-900">night</span>
                </div>
              </div>
              
              {/* Rating */}
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span className="text-sm text-gray-900">{property.rating}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default Home;