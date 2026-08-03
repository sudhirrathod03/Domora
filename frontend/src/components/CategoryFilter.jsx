import React from 'react';
import { FaFire, FaBed, FaUmbrellaBeach, FaCampground, FaTractor, FaSnowflake, FaShip, FaIgloo } from 'react-icons/fa';
import { GiCastle, GiPoolDive } from 'react-icons/gi';

export const categories = [
  { label: "Trending", icon: <FaFire size={20} /> },
  { label: "Rooms", icon: <FaBed size={20} /> },
  { label: "Beachfront", icon: <FaUmbrellaBeach size={20} /> },
  { label: "Castles", icon: <GiCastle size={20} /> },
  { label: "Amazing Pools", icon: <GiPoolDive size={20} /> },
  { label: "Camping", icon: <FaCampground size={20} /> },
  { label: "Farms", icon: <FaTractor size={20} /> },
  { label: "Arctic", icon: <FaSnowflake size={20} /> },
  { label: "Domes", icon: <FaIgloo size={20} /> }, 
  { label: "Boats", icon: <FaShip size={20} /> },
];

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex overflow-x-auto gap-6 pt-2 pb-2 px-4 sm:px-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {categories.map((category) => (
        <div
          key={category.label}
          onClick={() => {
            if (selectedCategory === category.label) {
              onSelectCategory(null);
            } else {
              onSelectCategory(category.label);
            }
          }}
          className={`flex flex-col items-center justify-center min-w-[60px] gap-2 cursor-pointer transition-all duration-200 group
            ${selectedCategory === category.label 
              ? 'text-[#C2185B] border-b-2 border-[#C2185B] pb-2' 
              : 'text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-gray-400 pb-2 border-b-2 border-transparent'
            }
          `}
        >
          <div className="group-hover:scale-110 transition-transform duration-200">
            {category.icon}
          </div>
          <span className="text-xs font-medium whitespace-nowrap">
            {category.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CategoryFilter;