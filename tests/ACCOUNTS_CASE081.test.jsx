// tests/ACCOUNTS_CASE081.test.jsx
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import Users from "../src/components/layout/Users";
import { SearchProvider } from "../src/components/SearchContext";

// Mock API
vi.mock("../services/apiService", () => ({
  fetchAllUsers: vi.fn(() =>
    Promise.resolve([
      {
        uid: "u1",
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        location: "Mandaue City",
        role: "User",
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
      },
    ])
  ),
  updateUser: vi.fn(),
  addNewUser: vi.fn(),
}));

describe("Users Component - CASE-081 Delete User", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("removes user from list after confirming deletion", async () => {
    render(
      <SearchProvider>
        <Users />
      </SearchProvider>
    );

    const table = await screen.findByRole("table");
    let userRow = Array.from(table.querySelectorAll("tbody tr")).find((tr) =>
      within(tr).queryByText("John")
    );
    expect(userRow).toBeInTheDocument();

    const deleteButton = within(userRow).getByText(/Delete/i);
    fireEvent.click(deleteButton);

    const modal = screen.getByText(/Confirm Delete/i).closest("div");
    expect(modal).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete John Doe\?/i)
    ).toBeInTheDocument();

    const confirmButton = within(modal).getByText("Delete");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      userRow = Array.from(table.querySelectorAll("tbody tr")).find((tr) =>
        within(tr).queryByText("John")
      );
      expect(userRow).toBeUndefined();
    });
  });
});
