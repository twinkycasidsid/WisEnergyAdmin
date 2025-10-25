import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// mock ConfirmModal (so handleDelete never triggers)
vi.mock("../src/components/layout/ConfirmModal", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-confirm-modal" />,
}));

// mock RateModal: simulate missing fields
vi.mock("../src/components/layout/RateModal", () => ({
  __esModule: true,
  default: ({ isOpen, onSubmit }) =>
    isOpen ? (
      <div data-testid="mock-rate-modal">
        <button
          onClick={() =>
            onSubmit({
              city: "",
              month: "",
              rate: "",
            })
          }
        >
          Add Rate
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

describe("Manage Electricity Rates - CASE-104 Missing Field Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows validation error when fields are missing", async () => {
    api.fetchAllRates.mockResolvedValue([]);

    render(<Rates />);

    await waitFor(() =>
      expect(screen.getByText("Electricity Rates")).toBeInTheDocument()
    );

    const addBtn = screen.getAllByRole("button", { name: /add rate/i })[0];
    fireEvent.click(addBtn);

    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const modalAdd = await screen.findByText("Add Rate");
    fireEvent.click(modalAdd);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Please fill out all fields before submitting."
      );
    });
  });
});
