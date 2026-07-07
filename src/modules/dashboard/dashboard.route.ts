import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { getStats } from "./dashboard.controller";

const router = Router();
router.get("/", authenticate, getStats);
export default router;