import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import listingRoute from "./routes/listingRoutes.js";
import { json } from "express";
import userRoute from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import stripeRoute from "./routes/stripeRoute.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/middleware.js";
import { stripeWebhook } from "./controllers/stripeController.js";
import redisClient from "./config/redis.js";
// import aiRoute from "./routes/aiRoutes.js"
const app = express();

app.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);
app.use(cookieParser());

app.use(json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://domora-black.vercel.app"],
    credentials: true,
  })
);

app.use("/", listingRoute);
app.use("/", userRoute);
app.use("/bookings", bookingRoutes);
app.use("/", stripeRoute);
// app.use("/",aiRoute)
const PORT = process.env.PORT;

const startServer = () => {
  connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

app.use(errorHandler);
startServer();
