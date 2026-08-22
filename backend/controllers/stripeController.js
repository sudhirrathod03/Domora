import asyncHandler from "../utils/asyncHandler.js";
import Booking from "../models/bookingModel.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const createCheckout = asyncHandler(async (req, res) => {
  const { title, price, nights, listingId, checkIn, checkOut, guests } = req.body;
  const userId = req.user._id.toString(); 

  // Are these dates already locked by someone else?
  const overlappingBookings = await Booking.find({
    listing: listingId,
    // Look for both confirmed bookings AND someone currently on the checkout page
    status: { $in: ["confirmed", "pending"] }, 
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) },
  });

  if (overlappingBookings.length > 0) {
    return res.status(400).json({ 
      message: "Sorry, these dates are currently locked by another user. Please try again in 10 minutes." 
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [{
      price_data: {
        currency: "inr",
        product_data: { name: title },
        unit_amount: price * 100, 
      },
      quantity: nights,
    }],
    success_url: `http://localhost:5173/success`,
    cancel_url: `http://localhost:5173/cancel`,
    // We still pass metadata so the webhook knows what to verify
    metadata: {
      listingId,
      userId,
      checkIn,
      checkOut,
      guests: guests.toString(),
      totalPrice: (price * nights).toString(),
    }
  });

  // Calculate the exact time 10 minutes from right now
  const expirationTime = new Date(Date.now() + 10 * 60 * 1000); 

  await Booking.create({
    listing: listingId,
    user: userId,
    checkIn: new Date(checkIn),
    checkOut: new Date(checkOut),
    totalPrice: price * nights,
    guests,
    status: "pending", 
    stripeSessionId: session.id, // Tie this lock to the specific Stripe page
    expiresAt: expirationTime, // The self-destruct timer!
  });

  res.status(200).json({ url: session.url });
});

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log("Webhook verified. Event type:", event.type);
  } catch (err) {
    console.error("Webhook Signature Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const sessionId = session.id;

    console.log("💰 Payment successful! Confirming pending booking...");

    try {

      const existingBooking = await Booking.findOne({ stripeSessionId: sessionId });

      if (!existingBooking) {
        return res.status(404).send("Booking not found");
      }

      if (existingBooking.status === "confirmed") {
        return res.status(200).send("Already processed"); 
      }

      // Update the lock: Make it permanent and remove the self-destruct timer
      existingBooking.status = "confirmed";
      existingBooking.expiresAt = undefined; // Stops MongoDB from deleting it
      
      await existingBooking.save();



    } catch (dbError) {
      console.error("Database Error updating booking:", dbError);
    }
  }

  res.status(200).send("Received");
};