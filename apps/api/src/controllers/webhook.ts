import { Request, Response } from "express";
import { errorResponse, successResponse } from "../types/common/utils.js";
import { Resend } from "resend";
import { agent } from "../agent/index.js";
import { Proposal } from "../models/proposals.js";
import { Vendors } from "../models/vendors.js";
import Requests from "../models/requests.js";

const receiveProposal = async (req: Request, res: Response) => {
  const email_id = req.body.data.email_id;
  const resend = new Resend(process.env.RESEND_API_KEY);

  const email = await resend.emails.receiving.get(email_id);

  if (email.data) {
    try {
      const vendor_email = email.data.from;
      const to = email.data.to[0];
      const request_id = to?.match(
        /\+([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})@/,
      );
      const body = email.data.html;

      if (!request_id) {
        throw new Error("Invalid UUID format");
      }

      const request = await Requests.findOne({
        where: {
          id: request_id[1],
        },
      });

      if (!request) {
        throw new Error("Request not found");
      }

      const vendor = await Vendors.findOne({
        where: {
          email: vendor_email,
        },
      });

      if (!vendor) {
        throw new Error("Vendor not found");
      }

      const result = await agent.invoke({
        messages: [
          {
            role: "user",
            content: `Process this proposal ${JSON.stringify(body)}`,
          },
        ],
      });

      const proposal = await Proposal.create({
        vendorId: vendor.id,
        requestId: request.id,
        ...result.structuredResponse.requestFormat,
      });

      return res.send(
        successResponse({ proposal }, "Proposal received and acknowledged"),
      );
    } catch (e) {
      return res.send(errorResponse((e as Error).message));
    }
  } else {
    return res.send(errorResponse("Proposal not received"));
  }
};

export default { receiveProposal };
