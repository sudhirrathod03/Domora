import { searchListingsWithAI } from "../controllers/aiController.js";
import express from "express"
const router = express.Router()
router.post("/search/ai", searchListingsWithAI)

export default router