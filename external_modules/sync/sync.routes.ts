import { Router } from "express";
import { syncController } from "./sync.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
const router = Router();

router.post(
    "/sync",
    authMiddleware,
    syncController
);

export default router;