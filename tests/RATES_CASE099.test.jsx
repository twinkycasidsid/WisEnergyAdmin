import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { SearchProvider } from "../src/components/SearchContext";
import Rates from "../src/components/layout/Rates";

// --- Mock Data ---
const mockRates = [
  {
    id: "r1",
    city: "Mandaue City",
    year: 2025,
    month: "2025-01",
    rate: 12.45,
    set_at: "2025-01-05 08:00:00",
  },
  {
    id: "r2",
    city: "Lapu-Lapu City",
    year: 2025,
    month: "2025-02",
    rate: 13.1,
    set_at: "2025-02-10 10:30:00",
  },
  {
    id: "r3",
    city: "Mandaue City",
    year: 2024,
    month: "2024-12",
    rate: 11.95,
    set_at: "2024-12-15 09:15:00",
  },
];

vi.mock("../services/apiService", () => ({
  fetchAllRates: vi.fn(() => Promise.resolve(mockRates)),
  addOrUpdateRate: vi.fn(),
  deleteRate: vi.fn(),
}));

const renderWithProvider = (ui) => render(<SearchProvider>{ui}</SearchProvider>);

describe("Rates Component - CASE-099 Filter by City/Month", () => {
  it("filters rates by city and shows only the selected city's entries", async () => {
    renderWithProvider(<Rates />);

    // Wait for table to load
    await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument());

    // Get the city filter dropdown
    const selects = screen.getAllByRole("combobox");
    const cityFilter = selects[0]; // first select = city filter

    // Filter by "Mandaue City"
    await userEvent.selectOptions(cityFilter, "Mandaue City");

    // Wait for filtered rows
    const rows = await screen.findAllByRole("row");
    const dataRows = rows.filter(
      (row) => within(row).queryAllByRole("cell").length > 0
    );

    const cities = dataRows.map(
      (row) => within(row).getAllByRole("cell")[1].textContent
    );
    expect(cities.every((c) => c === "Mandaue City")).toBe(true);
  });

      it("filters rates by month and shows only entries for that month", async () => {
    renderWithProvider(<Rates />);

    await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument());

    const monthInput = document.getElementById("month");
    expect(monthInput).toBeTruthy();

    await userEvent.clear(monthInput);
    await userEvent.type(monthInput, "2025-02");
    monthInput.dispatchEvent(new Event("change", { bubbles: true }));

    await waitFor(() => {
      const rows = screen.getAllByRole("row");
      const dataRows = rows.filter(
        (row) => within(row).queryAllByRole("cell").length > 0
      );

      const months = dataRows.map(
        (row) => within(row).getAllByRole("cell")[3].textContent
      );
      expect(months.every((m) => m === "02")).toBe(true);
    });
  });


});
