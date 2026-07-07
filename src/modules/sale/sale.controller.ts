import { Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse } from "../../utils/ApiResponse";
import * as saleService from "./sale.sevice";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const createSale = catchAsync(async (req: AuthRequest, res: Response) => {
  const sale = await saleService.createSale({
    ...req.body,
    soldBy: req.user?.id,
  });
  res.status(201).json(new ApiResponse(true, "Sale created successfully", sale));
});

export const getSales = catchAsync(async (_req: AuthRequest, res: Response) => {
  const sales = await saleService.getSales();
  res.status(200).json(new ApiResponse(true, "Sales fetched successfully", sales));
});
