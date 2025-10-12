// tests/ACCOUNTS_CASE072.test.jsx
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import Users from "../src/components/layout/Users";
import { addNewUser, fetchAllUsers } from "../services/apiService";
import { SearchProvider } from "../src/components/SearchContext";

// Mock API functions
vi.mock("../services/apiService", () => ({
  fetchAllUsers: vi.fn(),
  addNewUser: vi.fn(),
}));

const renderWithProvider = (ui) =>
  render(<SearchProvider>{ui}</SearchProvider>);

describe("Manage Accounts - CASE-072", () => {
  const mockUsers = [
    {
      uid: "1",
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      location: "Mandaue City",
      role: "user",
      created_at: "2025-10-12T00:00:00Z",
      updated_at: "2025-10-12T00:00:00Z",
    },
  ];

  it("shows error when admin passwords do not match", async () => {
    fetchAllUsers.mockResolvedValue(mockUsers);

    renderWithProvider(<Users />);

    const plusButton = screen.getByRole("button", { name: /Add User Menu/i });
    await userEvent.click(plusButton);

    const addAdminButton = screen.getByRole("button", { name: /Add an Admin/i });
    await userEvent.click(addAdminButton);

    await userEvent.type(screen.getByPlaceholderText("First Name"), "Admin");
    await userEvent.type(screen.getByPlaceholderText("Last Name"), "User");
    await userEvent.type(screen.getByPlaceholderText("Email Address"), "admin.user@example.com");
    await userEvent.type(screen.getByPlaceholderText("Password"), "password123");
    await userEvent.type(screen.getByPlaceholderText("Confirm Password"), "password456");

    const locationSelect = screen.getAllByRole("combobox")[0];
    await userEvent.selectOptions(locationSelect, "Lapu-Lapu City");

    const createButton = screen.getByRole("button", { name: /Create/i });
    await userEvent.click(createButton);

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("Passwords do not match");
    });
  });
});
