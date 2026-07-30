import express from "express";
import { createReview, deleteReview } from "../controllers/reviewController.js";
import {
  createListing,
  deleteListing,
  getListing,
  updateListing,
  getAllListings,
} from "../controllers/listingControllers.js";
import { protect } from "../middleware/middleware.js";
const router = express.Router();

router.get("/listings", getAllListings);
router.get("/listings/:id", getListing);
router.post("/listings", protect, createListing);
router.put("/listings/:id", protect, updateListing);
router.delete("/listings/:id", protect, deleteListing);
router.post("/listings/:id/reviews", protect, createReview);
router.delete("/listings/:id/reviews/:reviewId", protect, deleteReview);

export default router;
