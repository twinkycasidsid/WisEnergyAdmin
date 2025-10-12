import '@testing-library/jest-dom';
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { vi } from "vitest";
import Users from "../src/components/layout/Users";
import { fetchAllUsers } from "../services/apiService";
import { SearchProvider } from "../src/components/SearchContext";

// Mock the fetchAllUsers function
vi.mock("../services/apiService", () => ({
  fetchAllUsers: vi.fn(),
}));

const renderWithProvider = (ui) => render(<SearchProvider>{ui}</SearchProvider>);

describe("Manage Accounts - CASE-064", () => {
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

  it("should display all users when Manage Accounts page is opened", async () => {
    fetchAllUsers.mockResolvedValue(mockUsers);

    renderWithProvider(<Users />);

    const table = await screen.findByRole("table");
    const tbody = table.querySelector("tbody");
    const rows = within(tbody).getAllByRole("row");

    expect(rows.length).toBe(mockUsers.length);

    const firstNames = rows.map((row) =>
      row.querySelector("td:nth-child(2)").textContent
    );
    expect(firstNames).toEqual(mockUsers.map((u) => u.first_name));

    const lastNames = rows.map((row) =>
      row.querySelector("td:nth-child(3)").textContent
    );
    expect(lastNames).toEqual(mockUsers.map((u) => u.last_name));

    const roles = rows.map((row) => row.querySelector("td:nth-child(6)").textContent);
    expect(roles).toEqual(mockUsers.map((u) => u.role));

    const emails = rows.map((row) =>
      row.querySelector("td:nth-child(4)").textContent
    );
    expect(emails).toEqual(mockUsers.map((u) => u.email));
  });
});
