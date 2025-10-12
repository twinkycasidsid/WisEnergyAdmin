// tests/ACCOUNTS_CASE078.test.jsx
import React from "react";
import { render, fireEvent, waitFor, screen, within } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import Users from "../src/components/layout/Users";
import { SearchProvider } from "../src/components/SearchContext";
import "@testing-library/jest-dom";

// Mock API
vi.mock("../services/apiService", () => ({
  fetchAllUsers: vi.fn(() =>
    Promise.resolve([
      {
        uid: "a1",
        first_name: "Alice",
        last_name: "Admin",
        email: "alice@example.com",
        role: "Admin",
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
      },
    ])
  ),
  updateUser: vi.fn((uid, payload) =>
    Promise.resolve({ success: true, data: payload })
  ),
  addNewUser: vi.fn(),
}));

describe("Users Component - CASE-078 Edit Admin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update admin details successfully", async () => {
    render(
      <SearchProvider>
        <Users />
      </SearchProvider>
    );

    const table = await screen.findByRole("table");

    const adminRow = Array.from(table.querySelectorAll("tbody tr")).find((tr) =>
      within(tr).queryByText("Alice")
    );
    expect(adminRow).toBeInTheDocument();

    const editButton = within(adminRow).getByText(/Edit/i);
    fireEvent.click(editButton);

    const firstNameInput = await screen.findByPlaceholderText("First Name");
    const lastNameInput = screen.getByPlaceholderText("Last Name");
    const submitButton = screen.getByText("Update");

    fireEvent.change(firstNameInput, { target: { value: "Alicia" } });
    fireEvent.change(lastNameInput, { target: { value: "Admin Jr." } });

    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(alertMock).toHaveBeenCalledWith(
        "✅ User details updated successfully"
      )
    );

    alertMock.mockRestore();
  });
});
