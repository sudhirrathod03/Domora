import 'dotenv/config';
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import listingRoute from "./routes/listingRoutes.js"
import { json } from "express";
import userRoute from './routes/userRoutes.js'
import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser());
app.use(cors());
app.use(json())
app.use('/', listingRoute)
app.use('/', userRoute)
const PORT = process.env.PORT;

const startServer = () => {
  connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

app.use((err, req, res, next) => {
  console.error("Middleware Error:", err);
  res.status(500).json({ 
    message: "A middleware error occurred", 
    error: err.message || err 
  });
});
startServer()
