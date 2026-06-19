import { Router, RequestHandler } from "express";
import authRoutes from "../modules/auth/auth.routes";
import { authMiddleware } from "../modules/auth/auth.middleware";
import { resolveApp } from "../core/middlewares/resolve-app";
import { sendMailController } from "../modules/mailer/sendMail.controller";
import contactRoutes from "../modules/contact/contact.routes";

const router = Router();

router.use("/contact", contactRoutes);

router.use("/auth", authRoutes);

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.use("/account", authMiddleware, (req, res) => {
  const userId = (req as any).context.userId;
  res.json({ userId });
});

router.post(
  "/send",
  resolveApp as RequestHandler,
  sendMailController as RequestHandler
);

export default router;