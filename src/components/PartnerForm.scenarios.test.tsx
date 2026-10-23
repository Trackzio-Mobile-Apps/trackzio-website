import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/ui/sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.stubEnv("NEXT_PUBLIC_PARTNER_APPLICATION_ENDPOINT", "https://partner.example/apply");

const { default: PartnerForm } = await import("@/components/PartnerForm");
const { toast } = await import("@/components/ui/sonner");

function jsonResponse(status: number, body: unknown) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    json: async () => body,
  });
}

function installBrowser() {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  Element.prototype.scrollIntoView = () => {};
  vi.stubGlobal("navigator", { ...navigator, geolocation: undefined, language: "en" });
  vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({
    locale: "en-US",
    calendar: "gregory",
    numberingSystem: "latn",
    timeZone: "UTC",
  } as Intl.ResolvedDateTimeFormatOptions);
}

function countryButton() {
  return screen.getByRole("button", { name: /^Country\s*\*?$/ });
}

function stateButton() {
  return screen.getByRole("button", { name: /State or region/ });
}

async function chooseListed(button: HTMLElement, placeholder: string, query: string, optionName: string) {
  fireEvent.click(button);
  fireEvent.change(await screen.findByPlaceholderText(placeholder), { target: { value: query } });
  fireEvent.click(await screen.findByRole("option", { name: optionName }));
}

async function chooseCode(query: string, optionName: string) {
  fireEvent.click(screen.getByRole("button", { name: "Country code" }));
  const search = await screen.findByPlaceholderText("Search country or code");
  fireEvent.change(search, { target: { value: query } });
  fireEvent.click(await screen.findByRole("option", { name: optionName }));
}

describe("partner form scenarios", () => {
  beforeEach(() => {
    installBrowser();
    vi.mocked(toast.success).mockClear();
    vi.mocked(toast.error).mockClear();
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (String(url).includes("visitor-country")) {
          return jsonResponse(200, { country: null, city: null, region: null });
        }
        return jsonResponse(200, { ok: true, firstName: "Anita" });
      }),
    );
  });

  it("shows every required error on an empty form and does not send it", async () => {
    render(<PartnerForm initialCategory="" />);
    fireEvent.click(screen.getByRole("button", { name: "Send application" }));

    expect(await screen.findByText("Please choose how you want to partner.")).toBeInTheDocument();
    expect(screen.getByText("Please choose what you deal in.")).toBeInTheDocument();
    expect(screen.getByText("Please enter your full name.")).toBeInTheDocument();
    expect(screen.getByText("Please enter your email.")).toBeInTheDocument();
    expect(screen.getByText("Please choose a country code.")).toBeInTheDocument();
    expect(screen.getByText("Please enter your phone number.")).toBeInTheDocument();
    expect(screen.getByText("Please choose your country.")).toBeInTheDocument();
    expect(screen.getByText("Please choose your years of experience.")).toBeInTheDocument();
    expect(screen.getByText("Please agree so we can contact you about this application.")).toBeInTheDocument();
    expect(screen.getByText("Please check the highlighted fields and try again.")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalledWith("https://partner.example/apply", expect.anything());
  });

  it("asks for details only after Other is selected", () => {
    render(<PartnerForm initialCategory="" />);
    expect(screen.queryByLabelText(/How else do you want to partner/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/What else do you deal in/)).not.toBeInTheDocument();

    const [partnerOther, dealOther] = screen.getAllByRole("checkbox", { name: "Other" });
    fireEvent.click(partnerOther);
    fireEvent.click(dealOther);
    expect(screen.getByLabelText(/How else do you want to partner/)).toBeInTheDocument();
    expect(screen.getByLabelText(/What else do you deal in/)).toBeInTheDocument();

    fireEvent.click(partnerOther);
    expect(screen.queryByLabelText(/How else do you want to partner/)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/What else do you deal in/)).toBeInTheDocument();
  });

  it("pre-selects the category from the app page and shows where a shop sells", async () => {
    render(<PartnerForm initialCategory="coins" />);
    expect(screen.getByRole("checkbox", { name: "Coins" })).toBeChecked();
    expect(screen.queryByText("Where do you sell today?")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("checkbox", { name: "Shop or dealer" }));
    expect(screen.getByText("Where do you sell today?")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: "Physical shop" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "eBay" }));

    fireEvent.click(screen.getByRole("checkbox", { name: "Shop or dealer" }));
    expect(screen.queryByText("Where do you sell today?")).not.toBeInTheDocument();
  });

  it("rejects a bad email, a short phone, and a bad link, then keeps the typed values", async () => {
    render(<PartnerForm initialCategory="rocks" />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Expert or appraiser" }));
    fireEvent.change(screen.getByLabelText(/Full name/), { target: { value: "  A  " } });
    fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: "not-an-email" } });
    await chooseCode("91", "+91 India");
    fireEvent.change(screen.getByLabelText(/^Phone/), { target: { value: "12345" } });
    await chooseListed(countryButton(), "Search country", "india", "India");
    fireEvent.change(screen.getByLabelText(/Years of experience/), { target: { value: "5–10" } });
    fireEvent.change(screen.getByLabelText(/Website or social link/), { target: { value: "javascript:alert(1)" } });
    fireEvent.click(screen.getByRole("checkbox", { name: /I agree/ }));
    fireEvent.click(screen.getByRole("button", { name: "Send application" }));

    expect(await screen.findByText("Please enter your full name.")).toBeInTheDocument();
    expect(screen.getByText("Please enter a valid email.")).toBeInTheDocument();
    expect(screen.getByText("Please enter a valid phone number.")).toBeInTheDocument();
    expect(screen.getByText("Please enter a valid link.")).toBeInTheDocument();
    expect(screen.getByLabelText(/Full name/)).toHaveValue("  A  ");
    expect(screen.getByLabelText(/^Email/)).toHaveValue("not-an-email");
    expect(screen.getByLabelText(/^Phone/)).toHaveValue("12345");
    expect(fetch).not.toHaveBeenCalledWith("https://partner.example/apply", expect.anything());
  });

  it("clears a field error once that field is corrected", async () => {
    render(<PartnerForm initialCategory="banknotes" />);
    fireEvent.click(screen.getByRole("button", { name: "Send application" }));
    expect(await screen.findByText("Please enter your email.")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: "dealer@example.com" } });
    expect(screen.queryByText("Please enter your email.")).not.toBeInTheDocument();
  });

  it("switches the state list and calling code when the country changes", async () => {
    render(<PartnerForm initialCategory="" />);
    await chooseListed(countryButton(), "Search country", "india", "India");
    expect(stateButton()).toBeInTheDocument();
    expect(document.getElementById("partner-phone-country")).toHaveValue("IN");

    await chooseListed(stateButton(), "Search state", "guj", "Gujarat");
    fireEvent.change(screen.getByLabelText(/^City$/), { target: { value: "Ahmedabad" } });
    expect(screen.getByLabelText(/^City$/)).toHaveValue("Ahmedabad");

    await chooseListed(countryButton(), "Search country", "france", "France");
    expect(screen.getByLabelText("City and state")).toHaveValue("");
    expect(document.getElementById("partner-phone-country")).toHaveValue("FR");
    expect(screen.queryByLabelText("State or region")).not.toBeInTheDocument();
  });

  it("counts notes and stops the counter at 500", () => {
    render(<PartnerForm initialCategory="" />);
    const notes = screen.getByLabelText(/Anything else/);
    expect(screen.getByText("0/500")).toBeInTheDocument();
    fireEvent.change(notes, { target: { value: "Hello collectors" } });
    expect(screen.getByText("16/500")).toBeInTheDocument();
    fireEvent.change(notes, { target: { value: "n".repeat(500) } });
    expect(notes).toHaveValue("n".repeat(500));
    expect(screen.getByText("500/500")).toBeInTheDocument();
  });

  it("sends a shop application and replaces the form with the thank-you message", async () => {
    render(<PartnerForm initialCategory="coins" />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Shop or dealer" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Expert or appraiser" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Creator or club" }));
    const [partnerOther, dealOther] = screen.getAllByRole("checkbox", { name: "Other" });
    fireEvent.click(partnerOther);
    fireEvent.click(dealOther);
    fireEvent.click(screen.getByRole("checkbox", { name: "Bullion" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Physical shop" }));
    fireEvent.click(screen.getAllByRole("checkbox", { name: "Other" })[2]);
    fireEvent.change(screen.getByLabelText(/How else do you want to partner/), { target: { value: "Auction house" } });
    fireEvent.change(screen.getByLabelText(/What else do you deal in/), { target: { value: "Trading cards" } });
    fireEvent.change(screen.getByLabelText(/Where else do you sell/), { target: { value: "Instagram" } });
    fireEvent.change(screen.getByLabelText(/Full name/), { target: { value: "  Anita   Shah " } });
    fireEvent.change(screen.getByLabelText(/Business or page name/), { target: { value: "Shah Coins" } });
    fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: "Anita@Shop.example" } });
    await chooseCode("india", "+91 India");
    fireEvent.change(screen.getByLabelText(/^Phone/), { target: { value: "098765 43210" } });
    await chooseListed(countryButton(), "Search country", "india", "India");
    await chooseListed(stateButton(), "Search state", "gj", "Gujarat");
    fireEvent.change(screen.getByLabelText(/^City$/), { target: { value: "Ahmedabad" } });
    fireEvent.change(screen.getByLabelText(/Website or social link/), { target: { value: "instagram.com/shahcoins" } });
    fireEvent.change(screen.getByLabelText(/Years of experience/), { target: { value: "10–20" } });
    fireEvent.change(screen.getByLabelText(/^Specialties/), { target: { value: "Morgan dollars" } });
    fireEvent.change(screen.getByLabelText(/Anything else/), { target: { value: "We buy collections." } });
    fireEvent.click(screen.getByRole("checkbox", { name: /I agree/ }));
    fireEvent.click(screen.getByRole("button", { name: "Send application" }));

    expect(await screen.findByText("Thanks, Anita. We've got your application and will reply within 2 business days.")).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith("Application sent. We'll reply within 2 business days.");
    expect(screen.queryByLabelText(/Full name/)).not.toBeInTheDocument();

    const submitCall = vi.mocked(fetch).mock.calls.find((call) => call[0] === "https://partner.example/apply");
    expect(submitCall).toBeTruthy();
    const payload = JSON.parse(String((submitCall?.[1] as RequestInit).body));
    expect(payload).toMatchObject({
      fullName: "Anita Shah",
      email: "anita@shop.example",
      phone: "+919876543210",
      country: "India",
      cityState: "Ahmedabad, Gujarat",
      businessName: "Shah Coins",
      partnerTypes: ["Shop or dealer", "Expert or appraiser", "Creator or club", "Other: Auction house"],
      categories: ["Coins", "Bullion", "Other: Trading cards"],
      apps: ["Coinzy"],
      years: "10–20",
      website: "https://instagram.com/shahcoins",
      sellToday: ["Physical shop", "Other: Instagram"],
      notes: "We buy collections.",
      consent: true,
    });
  });

  it("keeps a filled expert application when saving fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (String(url).includes("visitor-country")) return jsonResponse(200, { country: null, city: null, region: null });
        return jsonResponse(503, { ok: false, error: "down" });
      }),
    );
    render(<PartnerForm initialCategory="antiques" />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Expert or appraiser" }));
    fireEvent.change(screen.getByLabelText(/Full name/), { target: { value: "Priya Mehta" } });
    fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: "priya@example.com" } });
    await chooseCode("44", "+44 United Kingdom");
    fireEvent.change(screen.getByLabelText(/^Phone/), { target: { value: "07911123456" } });
    await chooseListed(countryButton(), "Search country", "united kingdom", "United Kingdom");
    await chooseListed(stateButton(), "Search state", "eng", "England");
    fireEvent.change(screen.getByLabelText(/^City$/), { target: { value: "London" } });
    fireEvent.change(screen.getByLabelText(/Years of experience/), { target: { value: "2–5" } });
    fireEvent.click(screen.getByRole("checkbox", { name: /I agree/ }));
    fireEvent.click(screen.getByRole("button", { name: "Send application" }));

    expect(await screen.findByText("Couldn't send. Please try again.")).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith("Couldn't send. Please try again.");
    expect(screen.getByLabelText(/Full name/)).toHaveValue("Priya Mehta");
    expect(screen.getByLabelText(/^Email/)).toHaveValue("priya@example.com");
    expect(screen.getByLabelText(/^Phone/)).toHaveValue("07911123456");
    expect(screen.getByLabelText(/^City$/)).toHaveValue("London");
    expect(stateButton()).toHaveTextContent("England");
    expect(screen.getByRole("checkbox", { name: "Antiques" })).toBeChecked();
  });

  it("keeps the form when the network fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (String(url).includes("visitor-country")) return jsonResponse(200, { country: null, city: null, region: null });
        return Promise.reject(new Error("offline"));
      }),
    );
    render(<PartnerForm initialCategory="rocks" />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Creator or club" }));
    fireEvent.change(screen.getByLabelText(/Full name/), { target: { value: "Rock Club" } });
    fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: "club@example.com" } });
    await chooseCode("us", "+1 United States");
    fireEvent.change(screen.getByLabelText(/^Phone/), { target: { value: "(202) 555-0123" } });
    await chooseListed(countryButton(), "Search country", "united states", "United States");
    await chooseListed(stateButton(), "Search state", "texas", "Texas");
    fireEvent.change(screen.getByLabelText(/^City$/), { target: { value: "Austin" } });
    fireEvent.change(screen.getByLabelText(/Years of experience/), { target: { value: "20+" } });
    fireEvent.click(screen.getByRole("checkbox", { name: /I agree/ }));
    fireEvent.click(screen.getByRole("button", { name: "Send application" }));

    expect(await screen.findByText("Couldn't send. Please try again.")).toBeInTheDocument();
    expect(screen.getByLabelText(/^City$/)).toHaveValue("Austin");
    expect(stateButton()).toHaveTextContent("Texas");
  });

  it("sends one application when the button is clicked twice, and drops a stale city error after the country changes", async () => {
    let calls = 0;
    const pending: Array<(value: { ok: boolean; json: () => Promise<unknown> }) => void> = [];
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (String(url).includes("visitor-country")) return jsonResponse(200, { country: null, city: null, region: null });
        calls += 1;
        return new Promise((resolve) => pending.push(resolve));
      }),
    );
    render(<PartnerForm initialCategory="coins" />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Shop or dealer" }));
    fireEvent.change(screen.getByLabelText(/Full name/), { target: { value: "Anita Shah" } });
    fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: "anita@shop.example" } });
    await chooseCode("91", "+91 India");
    fireEvent.change(screen.getByLabelText(/^Phone/), { target: { value: "9876543210" } });
    await chooseListed(countryButton(), "Search country", "india", "India");
    await chooseListed(stateButton(), "Search state", "gj", "Gujarat");
    fireEvent.change(screen.getByLabelText(/^City$/), { target: { value: "Ahmedabad" } });
    fireEvent.change(screen.getByLabelText(/Years of experience/), { target: { value: "5–10" } });
    fireEvent.click(screen.getByRole("checkbox", { name: /I agree/ }));

    const send = screen.getByRole("button", { name: "Send application" });
    fireEvent.click(send);
    fireEvent.click(send);
    expect(calls).toBe(1);
    await act(async () => {
      pending[0]({
        ok: false,
        json: async () => ({ ok: false, errors: { cityState: "Please enter a shorter city and state." } }),
      });
    });
    expect(await screen.findByText("Please enter a shorter city and state.")).toBeInTheDocument();

    await chooseListed(countryButton(), "Search country", "france", "France");
    expect(screen.queryByText("Please enter a shorter city and state.")).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("City and state"), { target: { value: "Paris" } });
    fireEvent.click(screen.getByRole("button", { name: "Send application" }));
    expect(calls).toBe(2);
    await act(async () => {
      pending[1]({ ok: true, json: async () => ({ ok: true, firstName: "Anita" }) });
    });
    expect(await screen.findByText(/Thanks, Anita/)).toBeInTheDocument();
  });

  it("shows no country when the code search matches nothing", async () => {
    render(<PartnerForm initialCategory="" />);
    fireEvent.click(screen.getByRole("button", { name: "Country code" }));
    fireEvent.change(await screen.findByPlaceholderText("Search country or code"), { target: { value: "zzzz" } });
    expect(await screen.findByText("No country found.")).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "+91 India" })).not.toBeInTheDocument();
  });
});
