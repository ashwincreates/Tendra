import { Router } from "express";
import webhookController from "../controllers/webhook.js";

const webhookRouter = Router();

webhookRouter.post("/proposals", webhookController.receiveProposal);

export default webhookRouter;
