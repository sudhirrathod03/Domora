import { GoogleGenAI } from "@google/genai";
import * as z from "zod";
import Listing from "../models/listingModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import redisClient from "../config/redis.js";

const aiClient = new GoogleGenAI({});


const searchJsonSchema = {
  type: "object",
  properties: {
    location: {
      type: "string",
      description: "The city, state, or region mentioned. Null if none.",
    },
    maxPrice: {
      type: "integer",
      description: "The maximum price limit mentioned. Null if none.",
    },
    category: {
      type: "string",
      description:
        "The property type or vibe (e.g., Beach, Cabin, City). Null if none.",
    },
    guests: {
      type: "integer",
      description: "The number of people or guests mentioned. Null if none.",
    },
  },
};

const searchSchema = z.fromJSONSchema(searchJsonSchema); // it will double check all the things, like type, data etc...

export const searchListingsWithAI = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: "Please provide a search prompt." });
  }

  const interaction = await aiClient.interactions.create({
    model: "gemini-3.6-flash",
    input: `Extract search parameters from this user query: "${prompt}". If a value is missing, return null.`,
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: searchJsonSchema,
    },
  });

  const aiResult = searchSchema.parse(JSON.parse(interaction.output_text));
  console.log("🧠 AI Extracted:", aiResult);

  // 3. Construct the MongoDB Query dynamically
  let dbQuery = {};

  if (aiResult.location) {
    dbQuery.location = { $regex: aiResult.location, $options: "i" };
  }
  if (aiResult.category) {
    dbQuery.category = { $regex: aiResult.category, $options: "i" };
  }
  if (aiResult.maxPrice) {
    dbQuery.price = { $lte: aiResult.maxPrice };
  }

  if (aiResult.guests) {
    dbQuery.guests = { $gte: aiResult.guests }; 
  }



  const listings = await Listing.find(dbQuery).sort({ createdAt: -1 });

  res.status(200).json({
    parsedIntent: aiResult,
    results: listings
  });
});
