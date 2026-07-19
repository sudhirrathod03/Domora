import express from 'express'
import { createListing } from '../controllers/listingControllers.js'
// import { upload as uploadMiddleware } from '../cloudinary.js';
const router = express.Router()

// router.post('/listings', uploadMiddleware.single('image'), createListing)

export default router