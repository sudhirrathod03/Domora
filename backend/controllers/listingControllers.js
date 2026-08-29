import mongoose from "mongoose";
import Listing from "../models/listingModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import redisClient from "../config/redis.js";

export const getAllListings = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const cacheKey = `listings:${JSON.stringify(req.query)}`;
  const cachedListing = await redisClient.get(cacheKey);

  if (cachedListing) {
    console.log("serving from REDIS");
    return res.status(200).json(JSON.parse(cachedListing));
  }
  let dbQuery = {};
  // Category Filter
  if (category) {
    dbQuery.category = category;
  }
  if (search) {
    dbQuery.$or = [
      { location: { $regex: search, $options: "i" } },
      { country: { $regex: search, $options: "i" } },
      { title: { $regex: search, $options: "i" } },
    ];
  }

  const listings = await Listing.find(dbQuery).sort({ createdAt: -1 });

  await redisClient.set(cacheKey, JSON.stringify(listings), { EX: 3600 });
  res.status(200).json(listings);
});

export const createListing = asyncHandler(async (req, res) => {
  const { title, description, price, location, country, images, category } =
    req.body;

  const uploadedImages = req.files
    ? req.files.map((file) => ({ url: file.path }))
    : [];

  const mapboxToken = process.env.MAPBOX_TOKEN;
  const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    location
  )}.json?access_token=${mapboxToken}`;
  let geometry = { type: "Point", coordinates: [0, 0] };

  try {
    const response = await fetch(geocodeUrl);
    const data = await response.json();

    // if mapbox finds the location, grab the exact [lng, lat]
    if (data.features && data.features.length > 0) {
      geometry.coordinates = data.features[0].geometry.coordinates;
    }
  } catch (geoError) {
    console.error("Geocoding failed:", geoError);
  }

  const newListing = await Listing.create({
    title,
    description,
    price,
    location,
    country,
    images: uploadedImages,
    geometry,
    owner: req.user._id,
    category,
  });

  const cacheKey = await redisClient.keys("listings:*");
  if (cacheKey.length > 0) {
    console.log("cleared");
    await redisClient.del(cacheKey);
  }

  res.status(201).json({ success: true, listing: newListing });
});

export const getListing = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid listing id",
    });
  }

  const cacheKey = `listing:${id}`;
  const cachedListing = await redisClient.get(cacheKey);

  //1. cache hit
  if (cachedListing) {
    console.log("Serving from redis");
    return res.status(200).json(JSON.parse(cachedListing));
  }

  //2. cache miss
  console.log("🗄️ Serving Listing from MongoDB");
  const listing = await Listing.findById(id)
    .populate("owner") // populates the user who created the listing
    .populate({
      path: "reviews", // populates the reviews array
      populate: {
        path: "author", // populates the user who wrote each review
      },
    });

  if (!listing) {
    return res.status(404).json({ message: "Listing not found!" });
  }

  await redisClient.set(cacheKey, JSON.stringify(listing), { EX: 3600 });

  res.status(200).json(listing);
});

export const updateListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location, country, images } = req.body;

  // 1. Find the existing listing first
  const listing = await Listing.findById(id);
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  // 2. Default to the existing geometry in case the geocoding API fails
  let updatedGeometry = listing.geometry;

  // 3. If they provided a location, fetch the new coordinates from Mapbox
  if (location) {
    const mapboxToken = process.env.MAPBOX_TOKEN;
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      location
    )}.json?access_token=${mapboxToken}`;

    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        updatedGeometry = {
          type: "Point",
          coordinates: data.features[0].geometry.coordinates,
        };
      }
    } catch (geoError) {
      console.error("Geocoding failed during update:", geoError);
    }
  }

  // 4. Update the listing in the database with the new data + new coordinates
  const updatedListing = await Listing.findByIdAndUpdate(
    id,
    {
      title,
      description,
      price,
      location,
      country,
      images,
      geometry: updatedGeometry, // Save the updated coordinates
    },
    { new: true } // This option returns the updated document instead of the old one
  );

  res.status(200).json({ success: true, listing: updatedListing });
});

export const deleteListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const deletedListing = await Listing.findByIdAndDelete(id);
  if (!deletedListing) {
    return res.status(404).json({ message: "Listing not found" });
  }
  await redisClient.del(`listing:${id}`);
  const cachedKeys = await redisClient.keys("listings:*");
  if (cachedKeys.length > 0) {
    await redisClient.del(cachedKeys);
  }
  res.status(200).json({
    success: true,
    message: "Listing deleted successfully",
  });
});
