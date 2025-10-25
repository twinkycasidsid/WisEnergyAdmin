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

describe("Rates Component - CASE-101 Reset Filter", () => {
  it("clears all filters and restores full rate list", async () => {
    renderWithProvider(<Rates />);

    await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument());

    const selects = screen.getAllByRole("combobox");
    const cityFilter = selects[0];
    await userEvent.selectOptions(cityFilter, "Mandaue City");

    await waitFor(() => {
      const rows = screen.getAllByRole("row");
      const dataRows = rows.filter(
        (row) => within(row).queryAllByRole("cell").length > 0
      );
      expect(dataRows.length).toBe(2); 
    });

    const resetButton = screen.getByText("Reset Filter");
    await userEvent.click(resetButton);

    await waitFor(() => {
      const rows = screen.getAllByRole("row");
      const dataRows = rows.filter(
        (row) => within(row).queryAllByRole("cell").length > 0
      );

      const ids = dataRows.map((row) => within(row).getAllByRole("cell")[0].textContent);
      expect(ids).toEqual(["r1", "r2", "r3"]);

      const cities = dataRows.map((row) => within(row).getAllByRole("cell")[1].textContent);
      expect(cities).toEqual(["Mandaue City", "Lapu-Lapu City", "Mandaue City"]);
    });
  });
});
