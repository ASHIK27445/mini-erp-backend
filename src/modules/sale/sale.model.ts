import { Schema, model } from "mongoose";
import { ISale } from "./sale.interface";

const saleItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    // store a snapshot of product details to keep history intact even if product is deleted
    productSnapshot: {
      _id: { type: Schema.Types.ObjectId },
      name: { type: String },
      sku: { type: String },
      sellingPrice: { type: Number },
      image: { type: String },
    },
    quantity: { type: Number, required: true, min: 1 },
    priceAtSale: { type: Number, required: true },
  },
  { _id: false }
);

const saleSchema = new Schema<ISale>(
  {
    items: { type: [saleItemSchema], required: true },
    grandTotal: { type: Number, required: true },
    soldBy: { type: Schema.Types.ObjectId as any, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Sale = model<ISale>("Sale", saleSchema);