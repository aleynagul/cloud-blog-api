import jwt from "jsonwebtoken";
import { isTokenBlacklisted } from "../services/tokenBlacklist.service.js";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token gerekli" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Geçersiz token formatı" });
  }

try {
  const decoded = jwt.verify(token, JWT_SECRET);

  const blacklisted = await isTokenBlacklisted(token);
  if (blacklisted) {
    return res.status(401).json({ message: "Token logout edilmiş" });
  }

  req.user = decoded;
  next();
} catch (error) {
  return res.status(401).json({ message: "Token geçersiz" });
}

};
