import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as any;

    req.context = {
      ...req.context,
      userId: decoded.userId,
      appId: decoded.appId,
      role: decoded.role,
    };

    return next();

  } catch {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
};