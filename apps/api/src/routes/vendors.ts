import { Router } from "express";
import vendorsController from "../controllers/vendors.js";

const vendorRouter = Router();

vendorRouter.get("/", vendorsController.getAllVendors);

export default vendorRouter;
