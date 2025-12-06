import { Request, Response } from "express";
import { errorResponse, successResponse } from "../types/common/utils.js";
import Thread from "../models/thread.js";
import Requests from "../models/requests.js";
import { Vendors } from "../models/vendors.js";
import { Op } from "sequelize";
import { Resend } from "resend";

const createRequest = async (req: Request, res: Response) => {
  const { threadId } = req.params;
  const { request, vendors } = req.body;
  const thread = await Thread.findByPk(threadId);
  if (!thread) {
    return res.status(404).send(errorResponse("Thread not found"));
  }

  const newRequest = await Requests.create({
    threadId: thread.id,
    ...request,
    status: "PENDING",
  });

  console.log(vendors);
  const selectedVendors = await Vendors.findAll({
    where: {
      id: {
        [Op.in]: vendors,
      },
    },
  });

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: selectedVendors.map((vendor) => vendor.email),
    replyTo: `tendra+${newRequest.id}@prenezfli.resend.app`,
    subject: "New Request",
    text: `
    <h3>A new request has been posted</h3>
    title: ${newRequest.title},
    requirements: ${newRequest.requirements},
    budget: ${newRequest.budget},
    delivery: ${newRequest.delivery},
    payment: ${newRequest.payment},
    otherTerms: ${newRequest.otherTerms},

    Please review the request and respond accordingly.
    `,
  });

  if (error) {
    console.error(error);
  }

  return res.send(successResponse({}, "Request created successfully"));
};

export default { createRequest };
