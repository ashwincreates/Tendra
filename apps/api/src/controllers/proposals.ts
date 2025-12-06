import { Request, Response } from "express";
import Thread from "../models/thread.js";
import Requests from "../models/requests.js";
import { Proposal } from "../models/proposals.js";
import { Vendors } from "../models/vendors.js";
import { errorResponse, successResponse } from "../types/common/utils.js";

const compareProposals = async (req: Request, res: Response) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findByPk(threadId);
    if (!thread) throw new Error("Thread not found");
    const request = await Requests.findOne({
      where: {
        threadId: thread.id,
      },
    });
    if (!request) throw new Error("Request not found");
    const proposals = await Proposal.findAll({
      where: {
        requestId: request.id,
      },
      include: {
        model: Vendors,
        attributes: ["id", "name"],
      },
    });

    return res.send(successResponse({ proposals }));
  } catch (error) {
    return res.status(500).send(errorResponse((error as Error).message));
  }
};

export default { compareProposals };
