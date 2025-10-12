import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import Users from "../src/components/layout/Users";
import { fetchAllUsers } from "../services/apiService";
import { SearchProvider } from "../src/components/SearchContext";

vi.mock("../services/apiService", () => ({
  fetchAllUsers: vi.fn(),
}));

const renderWithProvider = (ui) =>
  render(<SearchProvider>{ui}</SearchProvider>);

describe("Manage Accounts - CASE-067", () => {
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

  it("should clear all filters and display full user list when Reset Filter is clicked", async () => {
    fetchAllUsers.mockResolvedValue(mockUsers);

    renderWithProvider(<Users />);

    const locationFilter = screen.getByLabelText("Location");
    const roleFilter = screen.getByLabelText("Role");
    const startDateFilter = screen.getByLabelText("Start Date");
    const endDateFilter = screen.getByLabelText("End Date");

    await userEvent.selectOptions(locationFilter, "Mandaue City");
    await userEvent.selectOptions(roleFilter, "user");
    await userEvent.type(startDateFilter, "2022-01-01");
    await userEvent.type(endDateFilter, "2022-02-01");

    const resetButton = screen.getByText("Reset Filter");
    await userEvent.click(resetButton);

    const rows = await screen.findAllByRole("row");
    const dataRows = rows.slice(1); 
    expect(dataRows.length).toBe(mockUsers.length);

    dataRows.forEach((row, index) => {
      const cells = row.querySelectorAll("td");
      expect(cells[1]).toHaveTextContent(mockUsers[index].first_name);
      expect(cells[2]).toHaveTextContent(mockUsers[index].last_name);
      expect(cells[4]).toHaveTextContent(mockUsers[index].location);
      expect(cells[5]).toHaveTextContent(mockUsers[index].role);
    });
  });
});
