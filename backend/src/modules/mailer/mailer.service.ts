import { db } from "../../core/db";
import { emails } from "../../core/db/schema";
import { eq } from "drizzle-orm";

import { sendEmail } from "./resend.provider";

type CreateEmailInput = {
  appId: number;
  to: string;
  subject: string;
  body: string;
};

export const mailerService = {
  async create(data: CreateEmailInput) {
    if (!data.to || !data.subject || !data.body) {
      throw new Error("Invalid email payload");
    }

    // 1. Guardar email como pending
    const [email] = await db
      .insert(emails)
      .values({
        appId: data.appId,
        to: data.to,
        subject: data.subject,
        body: data.body,
        status: "pending",
      })
      .returning();

    try {
      // 2. Enviar email
      await sendEmail({
        to: data.to,
        subject: data.subject,
        body: data.body,
      });

      // 3. Actualizar estado a sent
      await db
        .update(emails)
        .set({
          status: "sent",
          error: null,
        })
        .where(eq(emails.id, email.id));

      return {
        ...email,
        status: "sent",
      };

    } catch (err: any) {
      console.error("MAILER ERROR:", err);

      // 4. Guardar fallo
      await db
        .update(emails)
        .set({
          status: "failed",
          error: err?.message || "unknown_error",
        })
        .where(eq(emails.id, email.id));

      // 5. Relanzar error
      throw new Error(
        err?.message || "Email delivery failed"
      );
    }
  },
};