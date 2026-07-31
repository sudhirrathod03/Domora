import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { AuthContext } from "../context/AuthProvider.jsx";
import ListingMap from "../components/ListingMap.jsx";

function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Review form state
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const { user } = useContext(AuthContext);
  const isOwner = user && listing?.owner?._id === user._id;
  const navigate = useNavigate();

  const fetchListing = async () => {
    try {
      const res = await api.get(`/listings/${id}`);
      setListing(res.data);
    } catch (error) {
      console.error("Error fetching listing details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/listings/${id}`);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/listings/${id}/reviews`, { comment, rating });
      setComment("");
      setRating(5); // Reset stars to 5
      fetchListing();
    } catch (error) {
      console.error("Failed to submit review", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your review?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/listings/${id}/reviews/${reviewId}`);
      fetchListing(); // Refresh the page to remove the deleted review
    } catch (error) {
      console.error("Failed to delete review", error);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-20">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex-grow flex items-center justify-center py-20">
        <div className="text-gray-500 text-lg">Listing not found.</div>
      </div>
    );
  }

  const images = listing.images || [];
  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>

        {isOwner && (
          <div className="flex items-center gap-3">
            <Link
              to={`/listings/${listing._id}/edit`}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Hero Image Carousel */}
      <div className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] rounded-2xl overflow-hidden mb-8 bg-gray-200 shadow-sm group">
        {images.length > 0 && (
          <img
            src={images[currentImageIndex].url}
            alt={`${listing.title} - view ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        )}

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 cursor-pointer -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 cursor-pointer -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </>
        )}
      </div>

      {/* DETAILS SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
        <div className="md:w-2/3">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            About this space
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {listing.description}
          </p>
        </div>

        <div className="md:w-1/3 w-full bg-white border border-gray-200 rounded-xl shadow-md p-6 sticky top-24">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-gray-900">
              ${listing.price}
            </span>
            <span className="text-gray-500">night</span>
          </div>
        </div>
      </div>

      <hr className="border-gray-200 mb-12" />
      {listing.geometry && listing.geometry.coordinates && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Where you'll be
          </h2>
          <ListingMap coordinates={listing.geometry.coordinates} />
        </div>
      )}

      <hr className="border-gray-200 mb-12" />

      {/* REVIEWS SECTION */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Reviews ({listing.reviews?.length || 0})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {listing.reviews && listing.reviews.length > 0 ? (
            listing.reviews.map((review) => (
              <div
                key={review._id}
                className="relative p-4 border border-gray-200 rounded-xl"
              >
                {user && review.author?._id === user._id && (
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete Review"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                    {review.author?.name
                      ? review.author.name.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {review.author?.name ||
                        review.author?.email ||
                        "Unknown User"}
                    </h4>
                    <div className="flex text-[#C2185B] text-sm">
                      {"★".repeat(Number(review.rating) || 5)}
                      {"☆".repeat(5 - (Number(review.rating) || 5))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No reviews yet. Be the first to review!
            </p>
          )}
        </div>

        {/* Create Review Form */}
        {user ? (
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Leave a Review
            </h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                {/* NEW: Interactive Clickable Stars */}
                <div className="flex space-x-1 text-2xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`focus:outline-none transition-colors ${
                        star <= rating ? "text-[#C2185B]" : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment
                </label>
                <textarea
                  required
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#E76F2E] resize-none"
                  placeholder="Share your experience..."
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-[#C2185B] text-white font-semibold rounded-lg hover:bg-[#d65f24] transition-colors"
              >
                Submit Review
              </button>
            </form>
          </div>
        ) : (
          <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
            Please{" "}
            <Link
              to="/login"
              className="text-[#E76F2E] font-semibold hover:underline"
            >
              log in
            </Link>{" "}
            to leave a review.
          </p>
        )}
      </div>
    </div>
  );
}

export default ListingDetails;
