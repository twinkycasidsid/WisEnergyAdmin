import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import { describe, it, vi, beforeEach } from "vitest";
import Devices from "../src/components/layout/Devices";
import { SearchProvider } from "../src/components/SearchContext";

// Correctly mock the API
vi.mock("../services/apiService", () => ({
  fetchAllDevices: vi.fn(() =>
    Promise.resolve([
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
    ])
  ),
}));

describe("Devices Component - CASE-082 View Devices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays all registered devices with owner, ID, and status", async () => {
    render(
      <SearchProvider>
        <Devices />
      </SearchProvider>
    );

    await waitFor(() => expect(screen.getByText(/DEV001/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/DEV002/i)).toBeInTheDocument());

    const device1Row = screen.getByText("DEV001").closest("tr");
    const device2Row = screen.getByText("DEV002").closest("tr");

    expect(device1Row).toBeInTheDocument();
    expect(device2Row).toBeInTheDocument();

    expect(within(device1Row).getByText("Smart Plug 1")).toBeInTheDocument();
    expect(within(device1Row).getByText("John Doe")).toBeInTheDocument();
    expect(within(device1Row).getByText("1234")).toBeInTheDocument();
    expect(within(device1Row).getByText(/paired/i)).toBeInTheDocument();

    expect(within(device2Row).getByText("Smart Plug 2")).toBeInTheDocument();
    expect(within(device2Row).getByText("Jane Smith")).toBeInTheDocument();
    expect(within(device2Row).getByText("5678")).toBeInTheDocument();
    expect(within(device2Row).getByText(/unpaired/i)).toBeInTheDocument();
  });
});
