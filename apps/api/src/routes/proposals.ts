import { Router } from "express";
import proposalController from "../controllers/proposals.js";

const proposalRouter = Router();

proposalRouter.get("/:threadId", proposalController.compareProposals);

export default proposalRouter;
