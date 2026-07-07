import { Product } from "../product/product.model";
import { Sale } from "../sale/sale.model";

export const getDashboardStats = async () => {
  const [totalProducts, totalSales, lowStockProducts] = await Promise.all([
    Product.countDocuments(),
    Sale.countDocuments(),
    Product.find({ stockQuantity: { $lt: 5 } }).select("name sku stockQuantity"),
  ]);

  return { totalProducts, totalSales, lowStockCount: lowStockProducts.length, lowStockProducts };
};