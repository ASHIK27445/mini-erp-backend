import { Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse } from "../../utils/ApiResponse";
import * as productService from "./product.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const createProduct = catchAsync(async (req: AuthRequest, res: Response) => {
  const imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.image || req.body.imageUrl || "";
  const product = await productService.createProduct({ ...req.body, image: imagePath });
  res.status(201).json(new ApiResponse(true, "Product created successfully", product));
});

export const getProducts = catchAsync(async (req: AuthRequest, res: Response) => {
  const { data, meta } = await productService.getProducts(req.query);
  res.status(200).json(new ApiResponse(true, "Products fetched successfully", data, meta));
});

export const updateProduct = catchAsync(async (req: AuthRequest, res: Response) => {
  const imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.image || req.body.imageUrl;
  const payload = imagePath !== undefined ? { ...req.body, image: imagePath } : req.body;
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const product = await productService.updateProduct(id, payload);
  res.status(200).json(new ApiResponse(true, "Product updated successfully", product));
});

export const deleteProduct = catchAsync(async (req: AuthRequest, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await productService.deleteProduct(id);
  res.status(200).json(new ApiResponse(true, "Product deleted successfully", null));
});