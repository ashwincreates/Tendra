import { Router } from "express";
import requestController from "../controllers/request.js";

const requestRouter = Router();

requestRouter.post("/:threadId?", requestController.createRequest);

export default requestRouter;
