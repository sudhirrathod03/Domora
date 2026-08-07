import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthProvider";

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If not logged in, send them to login
    if (!user) {
      navigate("/login");
      return;
    }

    fetchMyTrips();
  }, [user, navigate]);

  const fetchMyTrips = async () => {
    try {
      const res = await api.get("/bookings/my-trips");
      setTrips(res.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTrip = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );
    if (!confirmCancel) return;

    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip._id === bookingId ? { ...trip, status: "cancelled" } : trip
        )
      );
      alert("Reservation cancelled successfully.");
    } catch (error) {
      console.error("Error cancelling trip:", error);
      alert(error.response?.data?.message || "Failed to cancel trip.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading your trips...
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Trips</h1>

      {trips.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No trips booked... yet!
          </h2>
          <p className="text-gray-600 mb-6">
            Time to dust off your bags and start planning your next adventure.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-[#C2185B] text-white font-bold rounded-lg hover:bg-[#a3124b] transition-colors"
          >
            Start searching
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => {
            const listing = trip.listing;
            if (!listing) return null;
            const checkInDate = new Date(trip.checkIn).toLocaleDateString(
              "en-US",
              { month: "short", day: "numeric", year: "numeric" }
            );
            const checkOutDate = new Date(trip.checkOut).toLocaleDateString(
              "en-US",
              { month: "short", day: "numeric", year: "numeric" }
            );

            // 1. Get the check-in date and strip the time down to midnight
            const checkInDateObj = new Date(trip.checkIn);
            checkInDateObj.setHours(0, 0, 0, 0);

            // 2. Get today's date and strip the time down to midnight
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // 3. Now compare them safely!
            const isPast = checkInDateObj < today;
            const isCancelled = trip.status === "cancelled";

            return (
              <div
                key={trip._id}
                className="border border-gray-200 rounded-2xl overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                <Link to={`/listings/${listing._id}`}>
                  <div className="relative aspect-video bg-gray-200">
                    {listing.images && listing.images.length > 0 && (
                      <img
                        src={listing.images[0].url}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {/* Status Badge */}
                    <div
                      className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                        isCancelled
                          ? "bg-red-100 text-red-700"
                          : isPast
                          ? "bg-gray-100 text-gray-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {isCancelled
                        ? "Cancelled"
                        : isPast
                        ? "Past Trip"
                        : "Upcoming"}
                    </div>
                  </div>
                </Link>

                <div className="p-5 flex-grow flex flex-col">
                  <Link
                    to={`/listings/${listing._id}`}
                    className="hover:underline"
                  >
                    <h3 className="font-bold text-lg text-gray-900 truncate">
                      {listing.location}, {listing.country}
                    </h3>
                    <p className="text-gray-500 text-sm truncate">
                      {listing.title}
                    </p>
                  </Link>

                  <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600 flex-grow">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Dates:</span>
                      <span>
                        {checkInDate} - {checkOutDate}
                      </span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Guests:</span>
                      <span>{trip.guests}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 mt-2">
                      <span>Total:</span>
                      <span>${trip.totalPrice}</span>
                    </div>
                  </div>

                  {!isPast && !isCancelled && (
                    <button
                      onClick={() => handleCancelTrip(trip._id)}
                      className="mt-5 w-full py-2 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Cancel Reservation
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyTrips;
