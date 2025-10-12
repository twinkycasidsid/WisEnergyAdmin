// tests/ACCOUNTS_CASE069.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import Users from "../src/components/layout/Users";
import { SearchProvider } from "../src/components/SearchContext";
import { addNewUser, fetchAllUsers } from "../services/apiService";
import '@testing-library/jest-dom'; 

vi.mock("../services/apiService", () => ({
  fetchAllUsers: vi.fn(),
  addNewUser: vi.fn(),
}));

const renderWithProvider = (ui) =>
  render(<SearchProvider>{ui}</SearchProvider>);

describe("Manage Accounts - CASE-069", () => {
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
    addNewUser.mockResolvedValue({ success: true, data: {} });
  });

  it("shows validation errors when required fields are missing", async () => {
    renderWithProvider(<Users />);

    fireEvent.click(screen.getByLabelText("Add User Menu"));

    const addUserButton = await screen.findByText("Add a User");
    fireEvent.click(addUserButton);

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("First Name is required");
      expect(alert).toHaveTextContent("Last Name is required");
      expect(alert).toHaveTextContent("Email is required");
      expect(alert).toHaveTextContent("Location is required");
    });
  });
});
