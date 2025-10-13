import '@testing-library/jest-dom';
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import Devices from "../src/components/layout/Devices";
import { fetchAllDevices } from "../services/apiService";
import { SearchProvider } from "../src/components/SearchContext";

vi.mock("../services/apiService", () => ({
  fetchAllDevices: vi.fn(),
}));

const renderWithProvider = (ui) => render(<SearchProvider>{ui}</SearchProvider>);

describe("Devices Component - CASE-083 Filter Devices", () => {
  const mockDevices = [
    {
      device_id: "d1",
      id: "DEV001",
      device_nickname: "Smart Plug 1",
      owner: "John Doe",
      pairing_code: "1234",
      paired_at: "2025-01-01T10:00:00Z",
      register_at: "2025-01-01T08:00:00Z",
      status: "paired",
    },
    {
      device_id: "d2",
      id: "DEV002",
      device_nickname: "Smart Plug 2",
      owner: "Jane Smith",
      pairing_code: "5678",
      paired_at: "2025-01-02T10:00:00Z",
      register_at: "2025-01-02T08:00:00Z",
      status: "unpaired",
    },
    {
      device_id: "d3",
      id: "DEV003",
      device_nickname: "Smart Plug 3",
      owner: "John Doe",
      pairing_code: "9101",
      paired_at: "2025-01-03T10:00:00Z",
      register_at: "2025-01-03T08:00:00Z",
      status: "paired",
    },
  ];

  beforeEach(() => {
    fetchAllDevices.mockResolvedValue(mockDevices);
    vi.clearAllMocks();
  });

  it("filters devices by status", async () => {
    renderWithProvider(<Devices />);
    const statusFilter = screen.getByRole("combobox");

    await userEvent.selectOptions(statusFilter, "unpaired");

    await waitFor(() => {
      expect(screen.getByText("DEV002")).toBeInTheDocument();
      expect(screen.queryByText("DEV001")).not.toBeInTheDocument();
      expect(screen.queryByText("DEV003")).not.toBeInTheDocument();
    });
  });

  it("filters devices by date range", async () => {
    renderWithProvider(<Devices />);

    const startDate = screen.getByLabelText("Start Date");
    const endDate = screen.getByLabelText("End Date");

    await userEvent.type(startDate, "2025-01-01");
    await userEvent.type(endDate, "2025-01-02");

    await waitFor(() => {
      expect(screen.getByText("DEV001")).toBeInTheDocument();
      expect(screen.getByText("DEV002")).toBeInTheDocument();
      expect(screen.queryByText("DEV003")).not.toBeInTheDocument();
    });
  });

  it("resets all filters", async () => {
    renderWithProvider(<Devices />);

    const statusFilter = screen.getByRole("combobox");
    await userEvent.selectOptions(statusFilter, "unpaired");

    const resetButton = screen.getByText("Reset Filter");
    await userEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.getByText("DEV001")).toBeInTheDocument();
      expect(screen.getByText("DEV002")).toBeInTheDocument();
      expect(screen.getByText("DEV003")).toBeInTheDocument();
    });
  });
});
