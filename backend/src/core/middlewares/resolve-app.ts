import { Request, Response, NextFunction } from "express";
import { eq, and } from "drizzle-orm";

import { db } from "../db";
import { apiKeys } from "../db/schema";

interface CustomRequest extends Request {
  context?: {
    userId?: number;
    appId?: number;
  };
}

export const resolveApp = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey || typeof apiKey !== "string") {
      res.status(401).json({
        error: "Missing API key",
      });

      return;
    }

    const key = await (db.query as any).apiKeys.findFirst({
      where: and(
        eq(apiKeys.key, apiKey),
        eq(apiKeys.active, true)
      ),
    });

    if (!key) {
      res.status(401).json({
        error: "Invalid API key",
      });

      return;
    }

    req.context = {
      appId: key.appId,
    };

    next();

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Resolve app failed",
    });
  }
};