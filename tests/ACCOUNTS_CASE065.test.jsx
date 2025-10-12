import '@testing-library/jest-dom';
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import Users from "../src/components/layout/Users";
import { fetchAllUsers } from "../services/apiService";
import { SearchProvider } from "../src/components/SearchContext";

// Mock the fetchAllUsers function
vi.mock("../services/apiService", () => ({
  fetchAllUsers: vi.fn(),
}));

// Helper to render with context
const renderWithProvider = (ui) => render(<SearchProvider>{ui}</SearchProvider>);

describe("Manage Accounts - CASE-065", () => {
  const mockUsers = [
    {
      uid: "1",
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      location: "Mandaue City",
      role: "User",
      created_at: "2022-01-01T00:00:00Z",
      updated_at: "2022-01-01T00:00:00Z",
    },
    {
      uid: "2",
      first_name: "Jane",
      last_name: "Doe",
      email: "jane.doe@example.com",
      location: "Lapu-Lapu City",
      role: "admin",
      created_at: "2022-02-01T00:00:00Z",
      updated_at: "2022-02-01T00:00:00Z",
    },
    {
      uid: "3",
      first_name: "Jake",
      last_name: "Doe",
      email: "jake.doe@example.com",
      location: "Mandaue City",
      role: "User",
      created_at: "2022-03-01T00:00:00Z",
      updated_at: "2022-03-01T00:00:00Z",
    },
  ];

  it("should update the list of accounts based on location filter", async () => {
    fetchAllUsers.mockResolvedValue(mockUsers);

    renderWithProvider(<Users />);

    const locationFilter = screen.getByLabelText("Location");
    await userEvent.selectOptions(locationFilter, "Mandaue City");

    await waitFor(() => {
      expect(screen.getByLabelText("John Doe")).toBeInTheDocument();
      expect(screen.getByLabelText("Jake Doe")).toBeInTheDocument();
      expect(screen.queryByLabelText("Jane Doe")).not.toBeInTheDocument();
    });
  });

 it("should update the list of accounts based on role filter", async () => {
  fetchAllUsers.mockResolvedValue(mockUsers);

  renderWithProvider(<Users />);

  const roleFilter = screen.getByLabelText("Role");
  // Use the value that matches the mock role (capitalization)
  await userEvent.selectOptions(roleFilter, "admin");

  await waitFor(() => {
    // Use getByText instead of getByLabelText
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
    expect(screen.queryByText("John")).not.toBeInTheDocument();
    expect(screen.queryByText("Jake")).not.toBeInTheDocument();
  });
});


  it("should update the list of accounts based on date range filter", async () => {
    fetchAllUsers.mockResolvedValue(mockUsers);

    renderWithProvider(<Users />);

    const startDateFilter = screen.getByLabelText("Start Date");
    const endDateFilter = screen.getByLabelText("End Date");

    await userEvent.type(startDateFilter, "2022-01-01");
    await userEvent.type(endDateFilter, "2022-02-01");

    await waitFor(() => {
      expect(screen.getByLabelText("John Doe")).toBeInTheDocument();
      expect(screen.getByLabelText("Jane Doe")).toBeInTheDocument();
      expect(screen.queryByLabelText("Jake Doe")).not.toBeInTheDocument();
    });
  });

  it("should reset all filters", async () => {
    fetchAllUsers.mockResolvedValue(mockUsers);

    renderWithProvider(<Users />);

    const locationFilter = screen.getByLabelText("Location");
    const roleFilter = screen.getByLabelText("Role");

    await userEvent.selectOptions(locationFilter, "Mandaue City");
    await userEvent.selectOptions(roleFilter, "admin");

    const resetButton = screen.getByText("Reset Filter");
    await userEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.getByLabelText("John Doe")).toBeInTheDocument();
      expect(screen.getByLabelText("Jane Doe")).toBeInTheDocument();
      expect(screen.getByLabelText("Jake Doe")).toBeInTheDocument();
    });
  });
});
