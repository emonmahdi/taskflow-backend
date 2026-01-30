import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith(`Bearer `)) {
    return res.status(401).json({ success: false, message: "Not Authorized" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("JWT verification failed ", err);
    return res
      .status(401)
      .json({ success: true, message: "Token invalid or expired" });
  }
};
