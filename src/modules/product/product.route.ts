import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import * as productController from "./product.controller";

const router = Router();

router.use(authenticate);

router.get("/", productController.getProducts); // all roles can view
router.post("/", authorize("admin", "manager"), productController.createProduct);
router.patch("/:id", authorize("admin", "manager"), productController.updateProduct);
router.delete("/:id", authorize("admin", "manager"), productController.deleteProduct);

export default router;