// tests/ACCOUNTS_CASE079.test.jsx
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import UserModal from "../src/components/layout/UserModal";

describe("Manage Accounts - CASE-079", () => {
  it("shows validation errors when editing an admin with empty fields", async () => {
    const handleSubmit = vi.fn();

    render(
      <UserModal
        isOpen={true}
        onClose={() => {}}
        onSubmit={handleSubmit}
        mode="edit"
        role="Admin"
        initialData={{
          first_name: "Alice",
          last_name: "Admin",
          email: "alice@example.com",
        }}
        existingEmails={["alice@example.com"]}
      />
    );

    const firstNameInput = screen.getByPlaceholderText("First Name");
    const lastNameInput = screen.getByPlaceholderText("Last Name");

    fireEvent.change(firstNameInput, { target: { value: "" } });
    fireEvent.change(lastNameInput, { target: { value: "" } });

    fireEvent.click(screen.getByRole("button", { name: /Update/i }));

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("First Name is required");
      expect(alert).toHaveTextContent("Last Name is required");
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
