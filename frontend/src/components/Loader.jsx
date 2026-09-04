import React, { useState, useEffect } from "react";

const FACTS = [
  "The first online hotel booking was made in 1994.",
  "Over 80% of travel bookings are now completed entirely online.",
  "There are over 17 million hotel rooms scattered across the globe.",
  "The shortest commercial flight in the world lasts just 57 seconds.",
  "Monaco is smaller than Central Park in New York City.",
  "The world's oldest operating hotel has been in business since 705 AD.",
];

function Loader({ fullScreen = true }) {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    // Cycle to the next fact every 3.5 seconds
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % FACTS.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullScreen
          ? "fixed inset-0 z-50 bg-white/90 backdrop-blur-sm"
          : "w-full py-20"
      }`}
    >
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute w-16 h-16 rounded-full border-4 border-[#C2185B]/20 animate-ping"></div>
    
        <div className="absolute w-16 h-16 rounded-full border-4 border-transparent border-t-[#C2185B] border-l-[#C2185B] animate-spin"></div>
     
        <div className="w-4 h-4 bg-[#C2185B] rounded-full animate-pulse"></div>
      </div>

      <div className="h-10 flex items-center justify-center max-w-md px-4 text-center">
        <p 
          key={factIndex} 
          className="text-sm font-medium text-gray-600 animate-pulse transition-all"
        >
          {FACTS[factIndex]}
        </p>
      </div>
    </div>
  );
}

export default Loader;