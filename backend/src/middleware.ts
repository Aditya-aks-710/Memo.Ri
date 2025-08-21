import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "./db";

interface JwtPayload {
  id?: string;
  iat?: number;
  exp?: number;
}

export async function UserAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Please sign in first." });
    }

    // support "Bearer <token>" or just the token
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : authHeader.trim();

    if (!token) {
      return res.status(401).json({ message: "Token missing." });
    }

    // verify token (wrap in try/catch to handle invalid/expired tokens)
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not set.");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    const payload = jwt.verify(token, secret) as JwtPayload | string;

    // Ensure payload is an object with an id string
    if (typeof payload === "object" && payload && typeof payload.id === "string") {
      const userId = payload.id;

      // Ensure user exists
      const user = await UserModel.findById(userId).select("_id").lean().exec();
      if (!user) {
        return res.status(401).json({ message: "User not found." });
      }

      // assign userId to request — cast req to any if you haven't added type augmentation
      (req as any).userId = userId;

      return next();
    } else {
      return res.status(403).json({ message: "Invalid token payload." });
    }
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}
