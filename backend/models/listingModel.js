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

    category: {
      type: String,
      enum: [
        "Trending",
        "Rooms",
        "Beachfront",
        "Castles",
        "Amazing Pools",
        "Camping",
        "Farms",
        "Arctic",
        "Domes",
        "Boats",
      ],
      required: true,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    location: { type: String, required: true },
    country: { type: String, required: true },
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // mapbox expects [longitude, latitude]
        required: true,
      },
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
