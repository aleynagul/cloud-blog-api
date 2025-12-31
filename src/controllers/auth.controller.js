import crypto from "crypto";
import jwt from "jsonwebtoken";
import { getUser, addUser } from "../data/users.data.js";
import { blacklistToken } from "../services/tokenBlacklist.service.js";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";


export const registerController = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "username ve password zorunlu" });
    }

    const existingUser = getUser(username);
    if (existingUser) {
      return res.status(400).json({ message: "Kullanıcı zaten var" });
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const user = addUser(username, hashedPassword);

    res.status(201).json({
      message: "Kayıt başarılı",
      userId: user.id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "username ve password zorunlu" });
    }

    const user = getUser(username);
    if (!user) {
      return res.status(401).json({ message: "Geçersiz bilgiler" });
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    if (hashedPassword !== user.password) {
      return res.status(401).json({ message: "Geçersiz bilgiler" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  
};

export const logoutController = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

    // JWT içinden exp al
    const decoded = jwt.verify(token, JWT_SECRET);
    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = decoded.exp - currentTime;

    if (remainingTime > 0) {
      await blacklistToken(token, remainingTime);
    }

    res.json({ message: "Çıkış yapıldı" });
  } catch (error) {
    res.status(400).json({ message: "Logout başarısız" });
  }
};

