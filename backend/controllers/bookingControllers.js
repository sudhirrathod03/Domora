import Booking from "../models/bookingModel.js";
import Listing from "../models/listingModel.js";

export const createBooking = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, totalPrice, guests } = req.body;
    const userId = req.user._id; 

    const overlappingBookings = await Booking.find({
      listing: listingId,
      status: { $ne: "cancelled" }, 
      checkIn: { $lt: new Date(checkOut) },
      checkOut: { $gt: new Date(checkIn) },
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ 
        message: "Sorry, these dates are already booked. Please select different dates." 
      });
    }

    const newBooking = await Booking.create({
      listing: listingId,
      user: userId,
      checkIn,
      checkOut,
      totalPrice,
      guests,
      status: "confirmed" 
    });

    res.status(201).json({ success: true, booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("listing") 
      .sort({ checkIn: 1 }); 

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getListingBookings = async (req, res) => {
  try {
    const { listingId } = req.params;
    const bookings = await Booking.find({ 
      listing: listingId,
      status: { $ne: "cancelled" }
    }).select("checkIn checkOut");
    
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params; 
    const userId = req.user._id;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (String(booking.user) !== String(userId)) {
      return res.status(403).json({ message: "You are not authorized to cancel this booking." });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ 
      success: true, 
      message: "Booking cancelled successfully.", 
      booking 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};