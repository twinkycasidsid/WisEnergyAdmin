// tests/ACCOUNTS_CASE071.test.jsx
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

describe("Manage Accounts - CASE-071", () => {
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

  const newAdmin = {
    uid: "2",
    first_name: "Admin",
    last_name: "User",
    email: "admin.user@example.com",
    location: "Lapu-Lapu City",
    role: "admin",
    created_at: "2025-10-12T00:00:00Z",
    updated_at: "2025-10-12T00:00:00Z",
  };

  it("should add a new Admin and display it in the list", async () => {
    fetchAllUsers.mockResolvedValue(mockUsers);
    addNewUser.mockResolvedValue({ success: true, data: newAdmin });

    renderWithProvider(<Users />);

    const plusButton = screen.getByRole("button", { name: /Add User Menu/i });
    await userEvent.click(plusButton);

    const addAdminButton = screen.getByRole("button", { name: /Add an Admin/i });
    await userEvent.click(addAdminButton);

    const firstNameInput = screen.getByPlaceholderText("First Name");
    const lastNameInput = screen.getByPlaceholderText("Last Name");
    const emailInput = screen.getByPlaceholderText("Email Address");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
    const locationSelect = screen.getAllByRole("combobox")[0];

    await userEvent.type(firstNameInput, newAdmin.first_name);
    await userEvent.type(lastNameInput, newAdmin.last_name);
    await userEvent.type(emailInput, newAdmin.email);
    await userEvent.type(passwordInput, "password123");
    await userEvent.type(confirmPasswordInput, "password123");
    await userEvent.selectOptions(locationSelect, newAdmin.location);

    const createButton = screen.getByRole("button", { name: /Create/i });
    await userEvent.click(createButton);

    await waitFor(() => {
      const rows = screen.getAllByRole("row").slice(1); 
      expect(rows.length).toBe(2);

      const addedRow = rows.find((row) =>
        row.textContent.includes(newAdmin.first_name)
      );
      expect(addedRow).toBeInTheDocument();
      expect(addedRow).toHaveTextContent(newAdmin.last_name);
      expect(addedRow).toHaveTextContent(newAdmin.email);
      expect(addedRow).toHaveTextContent(newAdmin.location);
      expect(addedRow).toHaveTextContent(newAdmin.role);
    });
  });
});
