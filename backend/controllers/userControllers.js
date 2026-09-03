import User from "../models/usersModel.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Review from "../models/reviewModel.js";
import Listing from "../models/listingModel.js";
import { generateToken } from "../utils/generateToken.js";
import asyncHandler from "../utils/asyncHandler.js";
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exist = await User.findOne({ email });
  if (exist) {
    return res.status(400).json({ message: "User already exists!" });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashPassword,
  });

  const token = generateToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User does not exists!" });
  }

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    return res.status(400).json({ message: "Invalid credential!" });
  }
  const token = generateToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.json({
    success: true,
    user,
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  const userReviews = await Review.find({ author: id });
  const reviewIds = userReviews.map((review) => review._id);

  if (reviewIds.length > 0) {
    await Listing.updateMany(
      { reviews: { $in: reviewIds } },
      { $pull: { reviews: { $in: reviewIds } } }
    );
  }

  await Review.deleteMany({ author: id });

  const deletedUser = await User.findByIdAndDelete(id);

  if (!deletedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    success: true,
    message: "User and all their reviews deleted successfully",
  });
});
