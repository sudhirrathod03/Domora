import dotenv from "dotenv";
dotenv.config();
import {sampleListings} from "./data.js";
import Listing from "../models/listingModel.js";
import connectDB from "../config/db.js";
connectDB();
async function init() {
  try {
    await Listing.deleteMany({});
    await Listing.insertMany(sampleListings);

    console.log("Dummy listings inserted successfully!");
  } catch (error) {}
}

init();
