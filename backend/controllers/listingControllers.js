import mongoose from "mongoose";
import Listing from "../models/listingModel.js";

export const getAllListings = async (req, res) => {
  try {
    const {category} = req.query;
    const dbQuery = {}

    if(category){
      dbQuery.category = category
    }
    const listings = await Listing.find(dbQuery);

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createListing = async (req, res) => {
  try {
    const { title, description, price, location, country, images, category } = req.body;
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
      images: images || [],
      geometry,
      owner: req.user._id,
      category
    });

    res.status(201).json({ success: true, listing: newListing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getListing = async (req, res) => {
  try {
    const { id } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid listing id",
      });
    }

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

    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateListing = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
