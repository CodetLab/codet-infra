// src/modules/account/account.controller.ts

import { Request, Response } from "express";
import * as service from "./account.service";

export const getMeController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await service.getMe(userId);

    console.log("2 - SERVICE RESULT:", user);

    return res.json(user);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
export const updateProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { name } = req.body;

  const updated = await service.updateProfile(userId, name);

  res.json(updated);
};

export const changePasswordController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const result = await service.changePassword(
      userId,
      currentPassword,
      newPassword
    );

    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const deleteSessions = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { appId } = req.body;

  const result = await service.revokeSessions(userId, appId);

  res.json(result);
};