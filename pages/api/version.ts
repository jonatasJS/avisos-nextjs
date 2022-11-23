// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  version: string;
  name: string;
  dependencies: Object;
};

import { version, name, dependencies } from "../../package.json";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name, version, dependencies });
}
