import mongoose, { Mongoose } from "mongoose";
const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ url: { type: String, required: true } }],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
