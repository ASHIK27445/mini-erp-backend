import { Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse } from "../../utils/ApiResponse";
import { getDashboardStats } from "./dashboard.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const getStats = catchAsync(async (_req: AuthRequest, res: Response) => {
  const stats = await getDashboardStats();
  res.status(200).json(new ApiResponse(true, "Dashboard stats fetched successfully", stats));
});
