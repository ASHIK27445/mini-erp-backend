import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import * as saleController from "./sale.controller";

const router = Router();
router.use(authenticate);

router.post("/", authorize("admin", "manager", "employee"), saleController.createSale);
router.get("/", authorize("admin", "manager", "employee"), saleController.getSales);

export default router;