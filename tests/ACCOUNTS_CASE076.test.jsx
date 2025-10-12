// tests/ACCOUNTS_CASE076.test.jsx
import React from "react";
import { render, fireEvent, waitFor, screen, within } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import Users from "../src/components/layout/Users";
import { SearchProvider } from "../src/components/SearchContext";
import "@testing-library/jest-dom";

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
  updateUser: vi.fn((uid, payload) =>
    Promise.resolve({ success: true, data: payload })
  ),
  addNewUser: vi.fn(),
}));

describe("Users Component - CASE-076 Edit User", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update user details successfully", async () => {
    render(
      <SearchProvider>
        <Users />
      </SearchProvider>
    );

    const table = await screen.findByRole("table");

    const userRow = Array.from(table.querySelectorAll("tbody tr")).find((tr) =>
      within(tr).queryByText("John")
    );
    expect(userRow).toBeInTheDocument();

    const editButton = within(userRow).getByText(/Edit/i);
    fireEvent.click(editButton);

    const firstNameInput = await screen.findByPlaceholderText("First Name");
    const lastNameInput = screen.getByPlaceholderText("Last Name");
    const locationSelect = screen.getByLabelText("User Location");
    const submitButton = screen.getByText("Update");

    fireEvent.change(firstNameInput, { target: { value: "Jonathan" } });
    fireEvent.change(lastNameInput, { target: { value: "Doe Jr." } });
    fireEvent.change(locationSelect, { target: { value: "Lapu-Lapu City" } });

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
