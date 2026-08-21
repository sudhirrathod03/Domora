import asyncHandler from "../utils/asyncHandler.js";
import Booking from "../models/bookingModel.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const createCheckout = asyncHandler(async (req, res) => {

    const { title, price, nights, listingId, checkIn, checkOut, guests } = req.body;
    const userId = req.user._id.toString(); 
  
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

      metadata: {
        listingId,
        userId,
        checkIn,
        checkOut,
        guests: guests.toString(),
        totalPrice: (price * nights).toString(),
      }
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
  
      const { listingId, userId, checkIn, checkOut, guests, totalPrice } = session.metadata;
  
      try {
        const existingBooking = await Booking.findOne({ stripeSessionId: sessionId });
        if (existingBooking) {
          return res.status(200).send("Already processed"); 
        }

        const newBooking = await Booking.create({
          listing: listingId,
          user: userId,
          checkIn: new Date(checkIn),
          checkOut: new Date(checkOut),
          totalPrice: Number(totalPrice),
          guests: Number(guests),
          status: "confirmed",
          stripeSessionId: sessionId,
        });
  
      } catch (dbError) {
        console.error("Database Error saving booking:", dbError);
      }
    }
  
    res.status(200).send("Received");
  };