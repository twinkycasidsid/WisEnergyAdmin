import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

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
              rate: "13.50",
            })
          }
        >
          Add Rate
        </button>
      </div>
    ) : null,
}));

vi.mock("../src/components/SearchContext", () => ({
  useSearch: () => ({ searchQuery: "" }),
}));

vi.mock("../services/apiService");
import * as api from "../services/apiService";

describe("Manage Electricity Rates - CASE-103 Duplicate Rate Prevention", () => {
  let Rates;

  beforeAll(async () => {
    vi.doMock("../src/components/layout/ConfirmModal", () => ({
      __esModule: true,
      default: () => <div data-testid="mock-confirm-modal" />,
    }));

    Rates = (await import("../src/components/layout/Rates")).default;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("prevents duplicate month and city rate", async () => {
    api.fetchAllRates.mockResolvedValue([
      { id: 1, city: "Mandaue City", year: 2025, month: "03", rate: 12.34 },
    ]);

    const mockAddOrUpdate = vi.fn().mockResolvedValue({ success: true });
    api.addOrUpdateRate.mockImplementation(mockAddOrUpdate);

    render(<Rates />);

    await waitFor(() =>
      expect(screen.getByText("Electricity Rates")).toBeInTheDocument()
    );

    const addMain = screen.getAllByRole("button", { name: /add rate/i })[0];
    fireEvent.click(addMain);

    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const modalAdd = await screen.findByText("Add Rate");
    fireEvent.click(modalAdd);

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith(
        "Rate for this city and month already exists."
      )
    );

    expect(mockAddOrUpdate).not.toHaveBeenCalled();
  });
});
