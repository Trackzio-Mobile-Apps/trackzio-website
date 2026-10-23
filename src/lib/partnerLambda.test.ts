import { createRequire } from "module";
import path from "path";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const { handler, applicationRow } = require(path.resolve("lambda/partner-application/index.js")) as {
  handler: (event: { requestContext?: { http?: { method?: string } }; body?: string; httpMethod?: string }) => Promise<{
    statusCode: number;
    body: string;
  }>;
  applicationRow: (body: unknown) => { ok: boolean; row?: string[] };
};

async function post(body: unknown) {
  const response = await handler({
    requestContext: { http: { method: "POST" } },
    body: JSON.stringify(body),
  });
  return { status: response.statusCode, body: JSON.parse(response.body) as { ok?: boolean; error?: string; errors?: Record<string, string> } };
}

const complete = {
  fullName: "Anita Shah",
  email: "anita@shop.example",
  phone: "+919876543210",
  country: "India",
  cityState: "Ahmedabad, Gujarat",
  businessName: "Shah Coins",
  partnerTypes: ["Shop or dealer"],
  categories: ["Coins", "Bullion"],
  apps: ["Coinzy"],
  years: "10–20",
  website: `https://${"w".repeat(188)}.example.com`,
  specialties: "Morgan dollars",
  memberships: "ANA",
  sellToday: ["Physical shop"],
  notes: "We buy collections.",
  consent: true,
};

describe("partner lambda checks", () => {
  it("keeps every selected partner type, category, and sales channel in one cell", () => {
    const saved = applicationRow({
      ...complete,
      partnerTypes: ["Shop or dealer", "Expert or appraiser", "Creator or club", "Other: Auction house"],
      categories: ["Coins", "Bullion", "Antiques"],
      sellToday: ["Physical shop", "eBay", "Whatnot"],
    });
    expect(saved.ok).toBe(true);
    expect(saved.row?.[8]).toBe("Shop or dealer, Expert or appraiser, Creator or club, Other: Auction house");
    expect(saved.row?.[9]).toBe("Coins, Bullion, Antiques");
    expect(saved.row?.[15]).toBe("Physical shop, eBay, Whatnot");
  });

  it("accepts a full application and a link that grew when https:// was added", async () => {
    expect(complete.website.length).toBeGreaterThan(200);
    expect(complete.website.length).toBeLessThanOrEqual(220);
    const saved = await post(complete);
    expect(saved.status).not.toBe(400);
    expect(saved.body.errors).toBeUndefined();
  });

  it("rejects an empty application, a long name, and a link past the stored limit", async () => {
    const empty = await post({});
    expect(empty.status).toBe(400);
    expect(empty.body.errors?.fullName).toBe("Please enter your full name.");
    expect(empty.body.errors?.email).toBe("Please enter your email.");
    expect(empty.body.errors?.consent).toBe("Please agree so we can contact you about this application.");

    const longName = await post({ ...complete, fullName: "A".repeat(61) });
    expect(longName.status).toBe(400);
    expect(longName.body.errors?.fullName).toBe("Please enter a shorter name.");

    const longLink = await post({ ...complete, website: `https://${"w".repeat(230)}.example.com` });
    expect(longLink.status).toBe(400);
    expect(longLink.body.errors?.website).toBe("Please enter a shorter link.");
  });

  it("ignores a honeypot submission and refuses the wrong method", async () => {
    const honeypot = await post({ ...complete, fax: "spam" });
    expect(honeypot.status).toBe(200);
    expect(honeypot.body.ok).toBe(true);

    const wrongMethod = await handler({ requestContext: { http: { method: "GET" } } });
    expect(wrongMethod.statusCode).toBe(405);
  });
});
