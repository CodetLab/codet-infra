import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../../core/db";
import { ENV } from "../../core/config/env";

import { users, apps, userApps, userSettings } from "../../core/db/schema";
import { and, eq } from "drizzle-orm";

export const registerUser = async (
  email: string,
  password: string,
  appId: number
) => {

  // check user
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  let user;

  if (existing.length === 0) {
    const hashed = await bcrypt.hash(password, 10);

    const result = await db
      .insert(users)
      .values({
        email,
        password: hashed,
        name: "default",
      })
      .returning();

    user = result[0];

    // settings default
    await db.insert(userSettings).values({
      userId: user.id,
    });
  } else {
    user = existing[0];
  }

    // verificar si ya existe relación user-app
  const existingRelation = await db
  .select()
  .from(userApps)
  .where(
    and(
      eq(userApps.userId, user.id),
      eq(userApps.appId, appId)
    )
  )
  .limit(1);

if (existingRelation.length === 0) {
  await db.insert(userApps).values({
    userId: user.id,
    appId,
    role: "user",
  });
}


  return { id: user.id, email: user.email };
};

export const loginUser = async (
  email: string,
  password: string,
  appId: number
) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const user = result[0];
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  // verificar acceso
  const access = await db
    .select()
    .from(userApps)
    .where(
      and(
        eq(userApps.userId, user.id),
        eq(userApps.appId, appId)
      )
    )
    .limit(1);

  // si no existe relación, crearla
  if (access.length === 0) {
      await db.insert(userApps).values({
        userId: user.id,
        appId,
        role: "user",
      });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      appId,
    },
    ENV.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token };
};