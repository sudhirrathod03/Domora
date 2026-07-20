import express from 'express'
import { createListing, deleteListing, getListing, updateListing, getAllListings } from '../controllers/listingControllers.js'
import { protect } from '../middleware/middleware.js'
const router = express.Router()

router.get("/listings", getAllListings);
router.get('/listings/:id', getListing)
router.post('/listings', protect, createListing)
router.put('/listings/:id', protect, updateListing)
router.delete('/listings/:id', protect, deleteListing)
export default router