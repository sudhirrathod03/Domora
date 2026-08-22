import Booking from "../models/bookingModel.js";
import Listing from "../models/listingModel.js";

import asyncHandler from "../utils/asyncHandler.js";


export const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("listing")
    .sort({ checkIn: 1 });

  res.status(200).json(bookings);
});

export const getListingBookings = asyncHandler(async (req, res) => {
  const { listingId } = req.params;
  const bookings = await Booking.find({
    listing: listingId,
    status: { $ne: "cancelled" },
  }).select("checkIn checkOut");

  res.status(200).json(bookings);
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const booking = await Booking.findById(id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }
  if (String(booking.user) !== String(userId)) {
    return res
      .status(403)
      .json({ message: "You are not authorized to cancel this booking." });
  }

  booking.status = "cancelled";
  await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully.",
    booking,
  });
});
