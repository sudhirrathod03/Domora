import jwt from "jsonwebtoken";
import User from "../models/usersModel.js";
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not authorized!" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decode", decode);
    const user = await User.findById(decode.id).select("-password");

    if (!user) {
      return req.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: error.message,
    });
  }
};
