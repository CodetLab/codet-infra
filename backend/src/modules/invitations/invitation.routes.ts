import { Router } from "express";

import * as controller from "./invitation.controller";

import { authMiddleware } from "../../core/middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", controller.create);

router.get("/mine", controller.listMine);
router.get("/", controller.listByResource);

router.get("/token/:token", controller.findByToken);
router.get("/token/:token/validate", controller.validate);

router.post("/:id/accept", controller.accept);
router.post("/:id/decline", controller.decline);

router.post("/:id/revoke", controller.revoke);
router.post("/:id/expire", controller.expire);

export default router;