import mongoose from "mongoose";
import Review from "../models/reviewModel.js";
import Listing from "../models/listingModel.js";

export const createReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, rating } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid listing id" });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const newReview = await Review.create({
      comment,
      rating,
      author: req.user._id,
      listing: id,
    });

    listing.reviews.push(newReview);
    await listing.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      newReview,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    // /listings/:id/reviews/:reviewId
    const { id, reviewId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(reviewId)
    ) {
      return res.status(400).json({ message: "Invalid id" });
    }

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
