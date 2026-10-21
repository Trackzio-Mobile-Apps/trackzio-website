import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse<{ country: string | null }>) {
  const header = req.headers["x-vercel-ip-country"] ?? req.headers["cf-ipcountry"];
  const raw = Array.isArray(header) ? header[0] : header;
  const country = raw && /^[A-Za-z]{2}$/.test(raw) ? raw.toUpperCase() : null;
  res.setHeader("Cache-Control", "private, max-age=3600");
  res.status(200).json({ country });
}
