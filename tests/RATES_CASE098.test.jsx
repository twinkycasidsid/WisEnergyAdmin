import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
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

const renderWithProvider = (ui) =>
  render(<SearchProvider>{ui}</SearchProvider>);

describe("Rates Component - CASE-098 Manage Electricity Rates", () => {
  it("displays all rates with City, Month, Year, and Rate", async () => {
    renderWithProvider(<Rates />);

    await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument());

    const tableBodies = screen.getAllByRole("rowgroup");
    const tableBody = tableBodies[0];
    const rows = within(tableBody).getAllByRole("row");

    const first = within(rows[0]).getAllByRole("cell");
    expect(first[0]).toHaveTextContent("r1");
    expect(first[1]).toHaveTextContent("Mandaue City");
    expect(first[2]).toHaveTextContent("2025");
    expect(first[3]).toHaveTextContent("01");
    expect(first[4]).toHaveTextContent("12.45");
    expect(first[5]).toHaveTextContent("2025-01-05");

    const second = within(rows[1]).getAllByRole("cell");
    expect(second[0]).toHaveTextContent("r2");
    expect(second[1]).toHaveTextContent("Lapu-Lapu City");
    expect(second[2]).toHaveTextContent("2025");
    expect(second[3]).toHaveTextContent("02");
    expect(parseFloat(second[4].textContent)).toBeCloseTo(13.1, 2);
    expect(second[5]).toHaveTextContent("2025-02-10");

    const third = within(rows[2]).getAllByRole("cell");
    expect(third[0]).toHaveTextContent("r3");
    expect(third[1]).toHaveTextContent("Mandaue City");
    expect(third[2]).toHaveTextContent("2024");
    expect(third[3]).toHaveTextContent("12");
    expect(third[4]).toHaveTextContent("11.95");
    expect(third[5]).toHaveTextContent("2024-12-15");
  });
});
