import Booking from "../models/bookingModel.js";
import Listing from "../models/listingModel.js";

import asyncHandler from "../utils/asyncHandler.js";
export const createBooking = asyncHandler(async (req, res) => {
  const { listingId, checkIn, checkOut, totalPrice, guests } = req.body;
  const userId = req.user._id;

  const overlappingBookings = await Booking.find({
    listing: listingId,
    status: { $ne: "cancelled" },
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) },
  });

  console.log(overlappingBookings);

  if (overlappingBookings.length > 0) {
    return res.status(400).json({
      message:
        "Sorry, these dates are already booked. Please select different dates.",
    });
  }

  const newBooking = await Booking.create({
    listing: listingId,
    user: userId,
    checkIn,
    checkOut,
    totalPrice,
    guests,
    status: "confirmed",
  });

  res.status(201).json({ success: true, booking: newBooking });
});

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
