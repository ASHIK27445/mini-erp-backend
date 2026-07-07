import mongoose from "mongoose";
import { Sale } from "./sale.model";
import { Product } from "../product/product.model";
import { ApiError } from "../../utils/ApiError";

interface SaleInput {
  items: { product: string; quantity: number }[];
  soldBy: string;
}

export const createSale = async (payload: SaleInput) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let grandTotal = 0;
    const saleItems: any[] = [];

    for (const item of payload.items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) throw new ApiError(404, `Product not found: ${item.product}`);

      if (product.stockQuantity < item.quantity) {
        throw new ApiError(
          400,
          `Insufficient stock for "${product.name}". Available: ${product.stockQuantity}, Requested: ${item.quantity}`
        );
      }

      product.stockQuantity -= item.quantity;
      await product.save({ session });

      const lineTotal = product.sellingPrice * item.quantity;
      grandTotal += lineTotal;

      saleItems.push({
        product: product._id,
        productSnapshot: {
          _id: product._id,
          name: product.name,
          sku: product.sku,
          sellingPrice: product.sellingPrice,
        },
        quantity: item.quantity,
        priceAtSale: product.sellingPrice,
      });
    }

    const sale = await Sale.create(
      [{ items: saleItems, grandTotal, soldBy: payload.soldBy } as any],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return sale[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const getSales = async () => {
  // items.productSnapshot contains preserved data; still populate soldBy
  return Sale.find().populate("soldBy", "name role").sort("-createdAt");
};