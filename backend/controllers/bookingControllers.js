import Booking from "../models/bookingModel.js";
import Listing from "../models/listingModel.js";


export const createBooking = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, totalPrice, guests } = req.body;
    const userId = req.user._id; 
    const overlappingBookings = await Booking.find({
      listing: listingId,
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
    const bookings = await Booking.find({ listing: listingId }).select("checkIn checkOut");
    
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};