// src/modules/account/account.service.ts

import { db } from "../../core/db";
import { users, userApps } from "../../core/db/schema";
import bcrypt from "bcrypt";
import { eq, and, sql } from "drizzle-orm";


export const updateProfile = async (userId: number, name: string) => {
  const [updated] = await db
    .update(users)
    .set({ name })
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email
    });

  return updated;
};
export const getMe = async (userId: number) => {
  const user = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, userId),
  });

  console.log("1 - DB RESULT:", user);

  return user;
};

export const changePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string
) => {
  const user = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, userId),
  });

  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw new Error("Invalid password");

  const hashed = await bcrypt.hash(newPassword, 10);

  await db.update(users)
    .set({ password: hashed })
    .where(eq(users.id, userId));

  return { success: true };
};

export const revokeSessions = async (userId: number, appId: number) => {
  return db.delete(userApps).where(
    and(
      eq(userApps.user_id, userId),
      eq(userApps.app_id, appId)
    )
  );
};