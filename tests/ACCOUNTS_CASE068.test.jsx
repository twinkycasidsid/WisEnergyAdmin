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

describe("Manage Accounts - CASE-068", () => {
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
  ];

  const newUser = {
    uid: "2",
    first_name: "Alice",
    last_name: "Smith",
    email: "alice.smith@example.com",
    location: "Lapu-Lapu City",
    role: "user",
    created_at: "2025-10-12T00:00:00Z",
    updated_at: "2025-10-12T00:00:00Z",
  };

  it("should add a new User and display it in the list", async () => {
    fetchAllUsers.mockResolvedValue(mockUsers);
    addNewUser.mockResolvedValue({ success: true, data: newUser });

    renderWithProvider(<Users />);

    const plusButton = screen.getByRole("button", { name: /Add User Menu/i });
    await userEvent.click(plusButton);

    const addUserButton = screen.getByRole("button", { name: /Add a User/i });
    await userEvent.click(addUserButton);

    const firstNameInput = screen.getByPlaceholderText("First Name");
    const lastNameInput = screen.getByPlaceholderText("Last Name");
    const emailInput = screen.getByPlaceholderText("Email Address");

    const locationSelect = screen.getAllByRole("combobox")[0];

    await userEvent.type(firstNameInput, newUser.first_name);
    await userEvent.type(lastNameInput, newUser.last_name);
    await userEvent.type(emailInput, newUser.email);
    await userEvent.selectOptions(locationSelect, newUser.location);

    const createButton = screen.getByRole("button", { name: /Create/i });
    await userEvent.click(createButton);

    await waitFor(() => {
      const rows = screen.getAllByRole("row").slice(1); 
      expect(rows.length).toBe(2); 

      const addedRow = rows.find((row) =>
        row.textContent.includes(newUser.first_name)
      );
      expect(addedRow).toBeInTheDocument();
      expect(addedRow).toHaveTextContent(newUser.last_name);
      expect(addedRow).toHaveTextContent(newUser.email);
      expect(addedRow).toHaveTextContent(newUser.location);
      expect(addedRow).toHaveTextContent(newUser.role);
    });
  });
});
