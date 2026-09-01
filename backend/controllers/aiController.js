import { GoogleGenAI } from "@google/genai";
import * as z from "zod";
import asyncHandler from "../utils/asyncHandler.js";

const aiClient = new GoogleGenAI({});

const generateJsonSchema = {
  type: "object",
  properties: {
    title: { 
      type: "string", 
      description: "A short, catchy property title (max 50 characters). Do not use quotes." 
    },
    description: { 
      type: "string", 
      description: "A warm, professional 3-paragraph property description highlighting amenities, vibe, and location. Use simple text, no markdown." 
    }
  },
  required: ["title", "description"]
};

const generateSchema = z.fromJSONSchema(generateJsonSchema);

export const generateListingDetails = asyncHandler(async (req, res) => {
  const { keywords } = req.body;

  if (!keywords) {
    return res.status(400).json({ message: "Please provide keywords." });
  }

  const interaction = await aiClient.interactions.create({
    model: "gemini-3.6-flash",
    input: `Act as an expert real estate copywriter. Generate a listing title and description based on these keywords: "${keywords}".`,
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: generateJsonSchema,
    },
  });

  const aiResult = generateSchema.parse(JSON.parse(interaction.output_text));
  
  res.status(200).json(aiResult);
});