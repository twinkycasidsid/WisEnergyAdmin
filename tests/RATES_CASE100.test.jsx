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
    year: 2025,
    month: "2025-02",
    rate: 12.85,
    set_at: "2025-02-15 09:15:00",
  },
  {
    id: "r4",
    city: "Mandaue City",
    year: 2024,
    month: "2024-12",
    rate: 11.95,
    set_at: "2024-12-10 07:45:00",
  },
];

vi.mock("../services/apiService", () => ({
  fetchAllRates: vi.fn(() => Promise.resolve(mockRates)),
  addOrUpdateRate: vi.fn(),
  deleteRate: vi.fn(),
}));

const renderWithProvider = (ui) => render(<SearchProvider>{ui}</SearchProvider>);

describe("Rates Component - CASE-100 Apply Multiple Filters", () => {
  it("applies both city and month filters correctly", async () => {
    renderWithProvider(<Rates />);

    await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument());

    const selects = screen.getAllByRole("combobox");
    const cityFilter = selects[0]; 
    await userEvent.selectOptions(cityFilter, "Mandaue City");

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

      expect(dataRows.length).toBe(1);

      const cells = within(dataRows[0]).getAllByRole("cell");
      expect(cells[0]).toHaveTextContent("r3");
      expect(cells[1]).toHaveTextContent("Mandaue City");
      expect(cells[3]).toHaveTextContent("02");
      expect(cells[4]).toHaveTextContent("12.85");
    });
  });
});
