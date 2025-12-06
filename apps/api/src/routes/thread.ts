import { Router } from "express";
import threadController from "../controllers/thread.js";

const threadRouter = Router();

threadRouter.get("/:id", threadController.getThread);

export default threadRouter;
