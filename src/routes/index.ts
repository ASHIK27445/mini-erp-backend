import { Router } from "express";
import authRoutes from "../modules/auth/auth.route";
import productRoutes from "../modules/product/product.route";
import saleRoutes from "../modules/sale/sale.route";
import dashboardRoutes from "../modules/dashboard/dashboard.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/sales", saleRoutes);
router.use("/dashboard", dashboardRoutes);

router.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Mini ERP API is running" });
});

export default router;
