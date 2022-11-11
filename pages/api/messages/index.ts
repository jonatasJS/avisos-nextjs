// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { messages } from "../../../services/models/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const messagesResult = await messages.find();

  return res.json(messagesResult);
}
