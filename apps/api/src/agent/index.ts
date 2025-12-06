import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAgent, tool } from "langchain";
import z from "zod";
import Thread from "../models/thread.js";
import { Proposal } from "../models/proposals.js";
import Requests from "../models/requests.js";

export const systemPrompt = `
  You are an agent responsible for understanding user requests and vendor proposals.

  You must ALWAYS respond in the following EXACT JSON format, with NO additional text:

  {
    "message": "<Your acknowledgement to the user. Do NOT repeat the user's message.>",
    "responseFormat": {
      "title": "<Short summary of the user's request>",
      "requirements": "<Specific requirements extracted>",
      "budget": "<Budget>",
      "delivery": "<Delivery timeline>",
      "payment": "<Payment terms>",
      "otherTerms": "<Other terms or empty string>"
    }
  }

  STRICT RULES:
  - Never copy or repeat the user's input inside "message".
  - Always return valid JSON.
  - DO NOT mention any UUID or sensitive information
  - If a field is missing, return an empty string for it.
  - If the user's request is unclear or incomplete, ask for clarification in "message" but still produce all fields.
  - You must not output anything outside the JSON object.

`;

const searchProposalsTool = tool(
  async ({ threadId }) => {
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
    });

    if (!proposals.length) {
      return "No proposals found";
    } else {
      return JSON.stringify(
        proposals.map((proposal) => ({
          title: proposal.title,
          requirements: proposal.requirements,
          budget: proposal.budget,
          delivery: proposal.delivery,
          payment: proposal.payment,
          otherTerms: proposal.otherTerms,
        })),
      );
    }
  },
  {
    name: "search_proposals",
    description: "search for proposals against a threadId",
    schema: z.object({
      threadId: z.string().describe("threadId to search for proposals against"),
    }),
  },
);

const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GOOGLE_API_KEY,
});

export const agent = createAgent({
  model: gemini,
  tools: [searchProposalsTool],
  systemPrompt: systemPrompt,
  responseFormat: z.object({
    message: z.string().describe("Acknowledgement to the user"),
    requestFormat: z
      .object({
        title: z.string().describe("Short summary of the user's request"),
        requirements: z.string().describe("Specific requirements extracted"),
        budget: z.string().describe("extracted budget requirements"),
        delivery: z.string().describe("Delivery timeline"),
        payment: z.string().describe("Payment terms"),
        otherTerms: z
          .string()
          .optional()
          .describe("Other terms or empty string"),
      })
      .optional(),
  }),
});
