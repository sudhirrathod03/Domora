import express from 'express'
import { createCheckout } from '../controllers/stripeController.js'
import { protect } from '../middleware/middleware.js'

const router = express.Router()
router.post("/checkout", protect, createCheckout)

export default router