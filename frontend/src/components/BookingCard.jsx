import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import api from "../services/api.js";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import toast from "react-hot-toast";

function BookingCard({ listing, user, isOwner, disabledDates }) {
  const navigate = useNavigate();
  const [bookingLoading, setBookingLoading] = useState(false);
  const [guests, setGuests] = useState(1);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // Dynamic price calculation
  const startDate = dateRange[0].startDate;
  const endDate = dateRange[0].endDate;
  const timeDifference = Math.abs(endDate.getTime() - startDate.getTime());
  const nightsCount = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  const totalPrice = listing ? nightsCount * listing.price : 0;
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0, 
    }).format(amount);
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please log in to book this property.");
      navigate("/login");
      return;
    }

    if (nightsCount === 0) {
      toast.error("Please select at least 1 night.");
      return;
    }

    try {
      setBookingLoading(true);
      const res = await api.post("/checkout", {
        title: listing.title,
        price: listing.price,
        nights: nightsCount,
        listingId: listing._id, 
        checkIn: startDate,
        checkOut: endDate,
        guests: guests,
        userId: user._id || user.id 
      });

      console.log("3. Backend responded with Stripe Session:", res.data);

      if (res.data.url) {
        console.log("4. Redirecting browser to Stripe...");
        window.location.href = res.data.url;
      }
      
    } catch (error) {
      console.error("Checkout process failed:", error);
      alert(error.response?.data?.message || "Failed to initiate checkout");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="lg:w-1/3 w-full bg-white border border-gray-200 rounded-2xl shadow-xl p-6 sticky top-24 z-10">
      <div className="flex items-baseline space-x-1 mb-6">
        <span className="text-2xl font-bold text-gray-900">
        {formatPrice(listing.price)}
        </span>
        <span className="text-gray-500">night</span>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden mb-4 flex justify-center bg-white">
        <DateRange
          ranges={dateRange}
          onChange={(item) => setDateRange([item.selection])}
          minDate={new Date()}
          disabledDates={disabledDates}
          rangeColors={["#C2185B"]}
          showDateDisplay={false}
          className="w-full max-w-full"
        />
      </div>

      <div className="border border-gray-300 rounded-lg p-3 mb-4 flex justify-between items-center">
        <label className="text-sm font-bold text-gray-700">GUESTS</label>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="outline-none bg-transparent font-medium text-gray-900 cursor-pointer"
        >
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </div>

      {!isOwner ? (
        <button
          onClick={handleBooking}
          disabled={bookingLoading}
          className="w-full py-3 bg-[#C2185B] text-white font-bold rounded-lg hover:bg-[#a3124b] transition-colors disabled:opacity-50 cursor-pointer"
        >
          {bookingLoading ? "Reserving..." : "Reserve"}
        </button>
      ) : (
        <div className="w-full py-3 bg-gray-100 text-gray-500 text-center font-bold rounded-lg">
          You own this property
        </div>
      )}

      {nightsCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-gray-600 mb-2">
            <span>
            {formatPrice(listing.price)} x {nightsCount} nights
            </span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-lg mt-4">
            <span>Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingCard;