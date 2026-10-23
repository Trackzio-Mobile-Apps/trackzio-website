import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PartnerForm from "@/components/PartnerForm";

function locationResponse(body: { country: string | null; city: string | null; region: string | null }) {
  return Promise.resolve({
    ok: true,
    json: async () => body,
  });
}

function field(id: string) {
  const element = document.getElementById(id);
  if (!(element instanceof HTMLSelectElement) && !(element instanceof HTMLInputElement)) {
    throw new Error(`Missing field ${id}`);
  }
  return element;
}

function countryButton() {
  return screen.getByRole("button", { name: /^Country\s*\*?$/ });
}

function stateButton() {
  return screen.getByRole("button", { name: /State or region/ });
}

async function chooseFromSearch(button: HTMLElement, placeholder: string, query: string, optionName: string) {
  fireEvent.click(button);
  fireEvent.change(await screen.findByPlaceholderText(placeholder), { target: { value: query } });
  fireEvent.click(await screen.findByRole("option", { name: optionName }));
}

describe("partner location fields", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(() => locationResponse({ country: "IN", city: "Ahmedabad", region: "GJ" })));
    vi.stubGlobal("navigator", { ...navigator, geolocation: undefined, language: "en-IN" });
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    Element.prototype.scrollIntoView = () => {};
  });

  it("fills the country, calling code, state, and city from the visitor", async () => {
    render(<PartnerForm initialCategory="" />);

    await waitFor(() => {
      expect(countryButton()).toHaveTextContent("India");
    });
    expect(field("partner-phone-country")).toHaveValue("IN");
    expect(stateButton()).toHaveTextContent("Gujarat");
    expect(screen.getByLabelText("City")).toHaveValue("Ahmedabad");
  });

  it("updates the calling code and state list when the country changes", async () => {
    render(<PartnerForm initialCategory="" />);
    await waitFor(() => {
      expect(countryButton()).toHaveTextContent("India");
    });

    await chooseFromSearch(countryButton(), "Search country", "united states", "United States");

    expect(field("partner-phone-country")).toHaveValue("US");
    expect(stateButton()).toHaveTextContent("Choose a state");
    expect(screen.getByLabelText("City")).toHaveValue("");
    await chooseFromSearch(stateButton(), "Search state", "tex", "Texas");
    expect(stateButton()).toHaveTextContent("Texas");

    await chooseFromSearch(countryButton(), "Search country", "france", "France");

    expect(field("partner-phone-country")).toHaveValue("FR");
    expect(screen.getByLabelText("City and state")).toHaveValue("");
  });

  it("filters the calling code list as you type", async () => {
    render(<PartnerForm initialCategory="" />);
    await waitFor(() => {
      expect(field("partner-phone-country")).toHaveValue("IN");
    });

    fireEvent.click(screen.getByRole("button", { name: "Country code" }));
    const search = await screen.findByPlaceholderText("Search country or code");
    fireEvent.change(search, { target: { value: "united states" } });

    expect(await screen.findByRole("option", { name: "+1 United States" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "+91 India" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("option", { name: "+1 United States" }));
    expect(field("partner-phone-country")).toHaveValue("US");
    expect(screen.getByRole("button", { name: "Country code" })).toHaveTextContent("+1 United States");
  });
});
