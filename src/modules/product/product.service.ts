import { Product } from "./product.model";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { ApiError } from "../../utils/ApiError";

export const createProduct = async (payload: any) => {
  if (!payload.image && !payload.imageUrl) {
    payload.image = "";
  }
  return Product.create(payload);
};

export const getProducts = async (query: Record<string, any>) => {
  const builder = new QueryBuilder(Product.find(), query)
    .search(["name", "sku", "category"])
    .filter()
    .sort()
    .paginate();

  const data = await builder.modelQuery;
  const meta = await builder.countTotal();
  return { data, meta };
};

export const updateProduct = async (id: string, payload: any) => {
  const product = await Product.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

export const deleteProduct = async (id: string) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};