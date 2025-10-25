import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// mock ConfirmModal to skip delete logic
vi.mock("../src/components/layout/ConfirmModal", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-confirm-modal" />,
}));

// mock RateModal — simulate editing with missing fields
vi.mock("../src/components/layout/RateModal", () => ({
  __esModule: true,
  default: ({ isOpen, onSubmit }) =>
    isOpen ? (
      <div data-testid="mock-rate-modal">
        <button
          onClick={() =>
            // city and month intentionally left blank
            onSubmit({ city: "", month: "", rate: "" })
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

describe("Manage Electricity Rates - CASE-106 Edit With Missing Fields", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows validation error when editing with missing fields", async () => {
    api.fetchAllRates.mockResolvedValue([
      { id: 1, city: "Mandaue City", year: 2025, month: "03", rate: 13.5 },
    ]);

    render(<Rates />);

    await waitFor(() =>
      expect(screen.getByText("Electricity Rates")).toBeInTheDocument()
    );

    const editBtn = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editBtn);

    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const saveBtn = await screen.findByText("Save Changes");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Please fill out all fields before submitting."
      );
    });

    expect(api.addOrUpdateRate).not.toHaveBeenCalled();
  });
});
