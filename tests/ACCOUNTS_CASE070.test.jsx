// tests/ACCOUNTS_CASE070.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import Users from "../src/components/layout/Users";
import { SearchProvider } from "../src/components/SearchContext";
import { addNewUser, fetchAllUsers } from "../services/apiService";
import '@testing-library/jest-dom'; // for toHaveTextContent

// Mock API functions
vi.mock("../services/apiService", () => ({
  fetchAllUsers: vi.fn(),
  addNewUser: vi.fn(),
}));

const renderWithProvider = (ui) =>
  render(<SearchProvider>{ui}</SearchProvider>);

describe("Manage Accounts - CASE-070", () => {
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

  beforeEach(() => {
    fetchAllUsers.mockResolvedValue(mockUsers);
    addNewUser.mockImplementation(({ email }) => {
      if (email.toLowerCase() === "john.doe@example.com") {
        return Promise.resolve({ success: false, message: "Email already exists" });
      }
      return Promise.resolve({ success: true, data: {} });
    });
  });

  it("shows duplicate email error when trying to add a user with existing email", async () => {
    renderWithProvider(<Users />);

    fireEvent.click(screen.getByLabelText("Add User Menu"));

    const addUserButton = await screen.findByText("Add a User");
    fireEvent.click(addUserButton);

    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "Smith" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email Address"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText("User Location"), {
      target: { value: "Mandaue City" },
    });

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("Email already exists");
    });
  });
});
