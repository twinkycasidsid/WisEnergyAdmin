import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { SearchProvider } from "../src/components/SearchContext";
import Rates from "../src/components/layout/Rates";
import { fetchAllRates, addOrUpdateRate } from "../services/apiService";

// --- Mock API service ---
vi.mock("../services/apiService", () => ({
  fetchAllRates: vi.fn(),
  addOrUpdateRate: vi.fn(),
  deleteRate: vi.fn(),
}));

const renderWithProvider = (ui) => render(<SearchProvider>{ui}</SearchProvider>);

describe("Manage Electricity Rates - CASE-102 Add New Rate", () => {
  const mockRates = [
    {
      id: "r1",
      city: "Mandaue City",
      year: 2025,
      month: "2025-01",
      rate: 12.45,
      set_at: "2025-01-05 08:00:00",
    },
  ];

  const newRate = {
    id: "r2",
    city: "Lapu-Lapu City",
    year: 2025,
    month: "2025-02",
    rate: 13.25,
    set_at: "2025-02-10 09:00:00",
  };

  it("should add a new rate and display it in the table", async () => {
    fetchAllRates.mockResolvedValue(mockRates);
    addOrUpdateRate.mockResolvedValue({ success: true });
    fetchAllRates.mockResolvedValueOnce(mockRates).mockResolvedValueOnce([
      ...mockRates,
      newRate,
    ]);

    renderWithProvider(<Rates />);

    await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument());

    const plusButton = screen.getAllByRole("button").find((b) =>
      b.className.includes("bg-[#43A866]")
    );
    await userEvent.click(plusButton);

    const modal = await screen.findByText("Add New Rate");
    const modalContainer = modal.closest("div");

    const citySelect = within(modalContainer).getByRole("combobox");
    const monthInput = within(modalContainer).getByLabelText("Month");
    const rateInput = within(modalContainer).getByLabelText(/Rate/);

    await userEvent.selectOptions(citySelect, newRate.city);
    await userEvent.type(monthInput, "2025-02");
    await userEvent.clear(rateInput);
    await userEvent.type(rateInput, newRate.rate.toString());

    const addButton = within(modalContainer).getByRole("button", { name: /Add Rate/i });
    await userEvent.click(addButton);

    await waitFor(() => {
      const rows = screen
        .getAllByRole("row")
        .filter((r) => r.querySelector("td"));
      expect(rows.length).toBe(2);

      const addedRow = rows.find((r) => r.textContent.includes(newRate.city));
      expect(addedRow).toBeInTheDocument();
      expect(addedRow).toHaveTextContent(newRate.city);
      expect(addedRow).toHaveTextContent("02");
      expect(addedRow).toHaveTextContent(newRate.rate.toString());
    });
  });
});
