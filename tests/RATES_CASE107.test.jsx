import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("../src/components/layout/ConfirmModal", () => ({
  __esModule: true,
  default: ({ isOpen, onConfirm }) =>
    isOpen ? (
      <div data-testid="mock-confirm-modal">
        <button onClick={onConfirm}>Confirm</button>
      </div>
    ) : null,
}));

vi.mock("../src/components/layout/RateModal", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-rate-modal" />,
}));

vi.mock("../src/components/SearchContext", () => ({
  useSearch: () => ({ searchQuery: "" }),
}));

vi.mock("../services/apiService", () => ({
  fetchAllRates: vi.fn(),
  addOrUpdateRate: vi.fn(),
  deleteRate: vi.fn(),
}));

import * as api from "../services/apiService";
import Rates from "../src/components/layout/Rates";

describe("Manage Electricity Rates – CASE-107 Delete Rate Entry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows confirmation modal and deletes rate entry", async () => {
    api.fetchAllRates
      .mockResolvedValueOnce([
        { id: 1, city: "Mandaue City", year: 2025, month: "2025-04", rate: 12.5 },
        { id: 2, city: "Lapu-Lapu City", year: 2025, month: "2025-05", rate: 11.8 },
      ])
      .mockResolvedValueOnce([
        { id: 1, city: "Mandaue City", year: 2025, month: "2025-04", rate: 12.5 },
      ]);

    const mockDelete = vi.fn().mockResolvedValue({ success: true });
    api.deleteRate.mockImplementation(mockDelete);

    render(<Rates />);

    await waitFor(() => {
      expect(screen.getByText("Mandaue City")).toBeInTheDocument();
      expect(screen.getByText("Lapu-Lapu City")).toBeInTheDocument();
    });

    const rows = screen.getAllByRole("row");
    const lapuRow = rows.find((r) =>
      within(r).queryByText("Lapu-Lapu City")
    );
    const deleteBtn = within(lapuRow).getByRole("button", { name: /delete/i });
    fireEvent.click(deleteBtn);

    expect(await screen.findByTestId("mock-confirm-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith(2);
      expect(api.fetchAllRates).toHaveBeenCalledTimes(2);
    });

    const tableBody = screen.getByRole("table").querySelector("tbody");
    const tableUtils = within(tableBody);
    expect(tableUtils.queryByText("Lapu-Lapu City")).not.toBeInTheDocument();
    expect(tableUtils.getByText("Mandaue City")).toBeInTheDocument();
  });
});
