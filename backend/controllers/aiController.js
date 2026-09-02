import { GoogleGenAI } from "@google/genai";
import Listing from "../models/listingModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import redisClient from "../config/redis.js";

const aiClient = new GoogleGenAI({});

export const summarizeListingReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id).populate("reviews");
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  const reviews = listing.reviews || [];

  if (reviews.length === 0) {
    return res.status(200).json({
      summary: {
        pros: [],
        cons: [],
        idealGuest: "Anyone looking for a fresh stay.",
        recurringComplaints: [],
      },
    });
  }
  const cacheKey = `summary:${id}:${reviews.length}`;
  const cachedSummary = await redisClient.get(cacheKey);

  if (cachedSummary) {
    console.log("⚡ Serving review summary from Redis");
    return res.status(200).json({ summary: JSON.parse(cachedSummary) });
  }

  // 3. Prepare review comments into clean bullet points
  const reviewTexts = reviews
    .map((r, idx) => `${idx + 1}. "${r.comment || r.body || ""}"`)
    .join("\n");

  const prompt = `
You are analyzing guest reviews for a rental property.
Reviews:
${reviewTexts}

Output a single valid JSON object strictly matching this shape:
{
  "pros": ["bullet 1", "bullet 2"],
  "cons": ["bullet 1", "bullet 2"],
  "idealGuest": "short description of who would enjoy this most",
  "recurringComplaints": ["complaint 1"]
}
`;

  const response = await aiClient.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  let rawText = response.text;
  if (rawText.startsWith("```")) {
    rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
  }

  const parsedSummary = JSON.parse(rawText);

  await redisClient.set(cacheKey, JSON.stringify(parsedSummary), {
    EX: 86400,
  });

  res.status(200).json({ summary: parsedSummary });
});