import { RequestHandler, Router } from "express";
import { login, register } from "./auth.controller";
import { resolveApp } from "../../core/middlewares/resolve-app";

const router = Router();

router.post("/register", resolveApp as RequestHandler, register);
router.post("/login", resolveApp as RequestHandler, login);

export default router;

