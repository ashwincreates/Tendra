import { Request, Response } from "express";
import { errorResponse, successResponse } from "../types/common/utils.js";
import Thread from "../models/thread.js";
import { Messages } from "../models/messages.js";
import Requests from "../models/requests.js";

const getThread = async (req: Request, res: Response) => {
  const { id } = req.params;
  const thread = await Thread.findByPk(id);
  if (!thread) {
    return res.status(404).send(errorResponse("Thread not found"));
  }
  const messages = await Messages.findAll({ where: { threadId: id } });
  const request = await Requests.findOne({ where: { threadId: id } });

  return res.send(successResponse({ thread, messages, request }));
};

export default { getThread };
