import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { fireEvent } from "@testing-library/react";

import Users from "../src/components/layout/Users";
import { fetchAllUsers } from "../services/apiService";
import { SearchProvider } from "../src/components/SearchContext";

vi.mock("../services/apiService", () => ({
  fetchAllUsers: vi.fn(),
}));

const renderWithProvider = (ui) =>
  render(<SearchProvider>{ui}</SearchProvider>);

describe("Manage Accounts - CASE-066", () => {
  const mockUsers = [
    {
      uid: "1",
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      location: "Mandaue City",
      role: "user",
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
      role: "user",
      created_at: "2022-03-01T00:00:00Z",
      updated_at: "2022-03-01T00:00:00Z",
    },
  ];

  it("should apply multiple filters (Location + Role + Date) and show correct users", async () => {
    fetchAllUsers.mockResolvedValue(mockUsers);

    renderWithProvider(<Users />);

    const locationFilter = screen.getByLabelText("Location");
    const roleFilter = screen.getByLabelText("Role");
    const startDateFilter = screen.getByLabelText("Start Date");
    const endDateFilter = screen.getByLabelText("End Date");

    await userEvent.selectOptions(locationFilter, "Mandaue City");
    await userEvent.selectOptions(roleFilter, "User");
    fireEvent.change(startDateFilter, { target: { value: "2022-01-01" } });
    fireEvent.change(endDateFilter, { target: { value: "2022-02-01" } });

    await waitFor(() => {
      const rows = screen.getAllByRole("row").slice(1); 
      expect(rows.length).toBe(1); 

      expect(rows[0]).toHaveTextContent("John");
      expect(rows[0]).toHaveTextContent("Doe");
      expect(rows[0]).toHaveTextContent("user"); 
      expect(rows[0]).toHaveTextContent("Mandaue City");
    });
  });
});
