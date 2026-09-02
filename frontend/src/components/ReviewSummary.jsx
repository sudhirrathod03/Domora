import React, { useEffect, useState } from "react";
import api from "../services/api.js";

function ReviewSummary({ listingId, reviewCount }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!reviewCount || reviewCount === 0) return;

    const fetchSummary = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/listings/${listingId}/summary`);
        setSummary(res.data.summary);
      } catch (error) {
        console.error("Failed to load review summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [listingId, reviewCount]);

  if (!reviewCount || reviewCount === 0) return null;

  if (loading) {
    return (
      <div className="p-5 my-6 rounded-xl border border-gray-200 bg-gray-50 animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="p-6 my-8 rounded-2xl border border-gray-200 bg-gray-50 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <span>✨</span> AI Review Breakdown
        </h3>
        <span className="text-xs font-medium text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded-full">
          Based on {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
        </span>
      </div>

      {/* Ideal Guest Badge */}
      {summary.idealGuest && (
        <div className="bg-white p-3 rounded-lg border border-gray-200 text-sm text-gray-700">
          <span className="font-semibold text-gray-900">Best for: </span>
          {summary.idealGuest}
        </div>
      )}

      {/* Pros and Cons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pros */}
        {summary.pros?.length > 0 && (
          <div className="bg-white p-4 rounded-xl border border-emerald-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">
              Highlights
            </h4>
            <ul className="space-y-1.5 text-sm text-gray-700">
              {summary.pros.map((pro, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Cons / Considerations */}
        {summary.cons?.length > 0 && (
          <div className="bg-white p-4 rounded-xl border border-amber-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
              Things to Note
            </h4>
            <ul className="space-y-1.5 text-sm text-gray-700">
              {summary.cons.map((con, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recurring Complaints */}
      {summary.recurringComplaints?.length > 0 && (
        <div className="bg-red-50 border border-red-100 p-3 rounded-lg text-xs text-red-800">
          <span className="font-semibold">Recurring mentions: </span>
          {summary.recurringComplaints.join(", ")}
        </div>
      )}
    </div>
  );
}

export default ReviewSummary;