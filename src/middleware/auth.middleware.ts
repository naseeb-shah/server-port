import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};
