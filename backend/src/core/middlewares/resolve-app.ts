import crypto from "crypto";
import { Response, NextFunction } from "express";
import { and, eq } from "drizzle-orm";

import { db } from "../db";
import { apiKeys } from "../db/schema";
import { AppRequest } from "../types/app-request";

export const resolveApp = async (
  req: AppRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const apiKey = req.header("X-API-Key");

    if (!apiKey) {
      res.status(401).json({
        error: "Missing API key",
      });

      return;
    }

    const keyHash = crypto
      .createHash("sha256")
      .update(apiKey)
      .digest("hex");

    const [key] = await db
      .select()
      .from(apiKeys)
      .where(
        and(
          eq(apiKeys.keyHash, keyHash),
          eq(apiKeys.active, true)
        )
      )
      .limit(1);

    if (!key) {
      res.status(401).json({
        error: "Invalid API key",
      });

      return;
    }

    req.context = {
      ...req.context,
      appId: key.appId,
    };

    console.log("RESOLVE APP:", req.context);

    next();

  } catch (error) {
    console.error("resolveApp error:", error);

    res.status(500).json({
      error: "Resolve app failed",
    });
  }
};