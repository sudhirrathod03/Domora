import { generateListingDetails } from "../controllers/aiController.js";
import express from "express"
const router = express.Router()
router.post("/generate", generateListingDetails)

export default router