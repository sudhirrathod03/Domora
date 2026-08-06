import express from "express";
import { 
  createBooking, 
  getUserBookings, 
  getListingBookings,
  cancelBooking 
} from "../controllers/bookingControllers.js";
import { protect } from "../middleware/middleware.js";

const router = express.Router();

router.get("/listing/:listingId", getListingBookings);
router.post("/", protect, createBooking);
router.get("/my-trips", protect, getUserBookings);
router.put("/:id/cancel", protect, cancelBooking);

export default router;