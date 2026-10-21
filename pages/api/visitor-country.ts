import type { NextApiRequest, NextApiResponse } from "next";

type LocationResponse = {
  country: string | null;
  city: string | null;
  region: string | null;
};

function headerValue(req: NextApiRequest, name: string): string {
  const value = req.headers[name];
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === "string" ? raw.trim() : "";
}

function countryCode(req: NextApiRequest): string | null {
  const raw =
    headerValue(req, "x-vercel-ip-country") ||
    headerValue(req, "cf-ipcountry") ||
    headerValue(req, "x-country") ||
    headerValue(req, "x-nf-country");
  return /^[A-Za-z]{2}$/.test(raw) ? raw.toUpperCase() : null;
}

function place(req: NextApiRequest, names: string[]): string | null {
  for (const name of names) {
    const value = headerValue(req, name);
    if (value && value.toLowerCase() !== "unknown") return value;
  }
  return null;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<LocationResponse>) {
  res.setHeader("Cache-Control", "private, max-age=3600");
  res.status(200).json({
    country: countryCode(req),
    city: place(req, ["x-vercel-ip-city", "x-city", "cf-ipcity"]),
    region: place(req, ["x-vercel-ip-country-region", "x-region", "x-subdivision", "cf-region"]),
  });
}
