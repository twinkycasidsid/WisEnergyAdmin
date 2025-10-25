import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// mock ConfirmModal to avoid handleDelete issues
vi.mock("../src/components/layout/ConfirmModal", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-confirm-modal" />,
}));

// mock RateModal — simulate editing an existing rate
vi.mock("../src/components/layout/RateModal", () => ({
  __esModule: true,
  default: ({ isOpen, onSubmit }) =>
    isOpen ? (
      <div data-testid="mock-rate-modal">
        <button
          onClick={() =>
            onSubmit({
              city: "Mandaue City",
              month: "2025-03",
              rate: "14.75",
            })
          }
        >
          Save Changes
        </button>
      </div>
    ) : null,
}));

// mock search context
vi.mock("../src/components/SearchContext", () => ({
  useSearch: () => ({ searchQuery: "" }),
}));

// mock API
vi.mock("../services/apiService", () => ({
  fetchAllRates: vi.fn(),
  addOrUpdateRate: vi.fn(),
  deleteRate: vi.fn(),
}));

import * as api from "../services/apiService";
import Rates from "../src/components/layout/Rates";

describe("Manage Electricity Rates - CASE-105 Edit Existing Rate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates existing rate and refreshes the data", async () => {
    // initial data: one existing rate
    api.fetchAllRates.mockResolvedValue([
      { id: 1, city: "Mandaue City", year: 2025, month: "03", rate: 13.5 },
    ]);

    const mockAddOrUpdate = vi.fn().mockResolvedValue({ success: true });
    api.addOrUpdateRate.mockImplementation(mockAddOrUpdate);

    render(<Rates />);

    await waitFor(() =>
      expect(screen.getByText("Electricity Rates")).toBeInTheDocument()
    );

    const editBtn = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editBtn);

    const modalBtn = await screen.findByText("Save Changes");
    fireEvent.click(modalBtn);

    await waitFor(() => {
      expect(mockAddOrUpdate).toHaveBeenCalledWith({
        city: "Mandaue City",
        year: 2025,
        month: "2025-03",
        rate: 14.75,
      });

      expect(api.fetchAllRates).toHaveBeenCalledTimes(2);
    });
  });
});
