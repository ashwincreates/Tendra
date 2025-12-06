import { Request, Response } from "express";
import { Vendors } from "../models/vendors.js";
import { successResponse } from "../types/common/utils.js";

const getAllVendors = async (req: Request, res: Response) => {
  const vendors = await Vendors.findAll();
  return res.send(successResponse({ vendors }));
};

export default { getAllVendors };
