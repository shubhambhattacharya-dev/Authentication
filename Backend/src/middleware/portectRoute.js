import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const ProtectRoute = async (req, res, next) => {
  try {
    // 1️⃣ Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token"
      });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Find user from DB
    const foundUser = await User.findById(decoded.id).select("-password");

    if (!foundUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not found"
      });
    }

    // 4️⃣ Attach user to request
    req.user = foundUser;

    // 5️⃣ Allow request
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid or expired token"
    });
  }
};
