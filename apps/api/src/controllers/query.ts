import { Request, Response } from "express";
import { errorResponse, successResponse } from "../types/common/utils.js";
import Thread from "../models/thread.js";
import { agent } from "../agent/index.js";
import { Messages } from "../models/messages.js";

const query = async (req: Request, res: Response) => {
  const { threadId } = req.params;
  const { query } = req.body;

  let thread = null;
  if (!threadId) {
    const result = await agent.invoke({
      messages: [{ role: "user", content: query }],
    });
    thread = await Thread.create({
      title: result.structuredResponse.requestFormat?.title,
    });

    return res.send(
      successResponse({ thread, response: result.structuredResponse }),
    );
  } else {
    thread = await Thread.findByPk(threadId);
    if (!thread) {
      return res.status(404).send(errorResponse("Thread not found"));
    }
  }

  await Messages.create({
    content: query,
    role: "user",
    threadId: thread.id,
  });

  const messages = await Messages.findAll({
    where: { threadId: thread.id, role: "user" },
    order: [["createdAt", "ASC"]],
  });

  const result = await agent.invoke({
    messages: [
      ...messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      { role: "human", content: `${thread.id}` },
    ],
  });

  return res.send(
    successResponse({
      thread,
      response: result.structuredResponse,
      messages: result.messages.map((m) => m.text),
    }),
  );
};

export default { query };
