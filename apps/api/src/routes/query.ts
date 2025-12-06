import { Router } from "express";
import queryController from "../controllers/query.js";

const queryRouter = Router();

queryRouter.post("/:threadId?", queryController.query);

export default queryRouter;
