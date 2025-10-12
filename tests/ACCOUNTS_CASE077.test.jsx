import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import UserModal from "../src/components/layout/UserModal";

describe("Manage Accounts - CASE-077", () => {
  it("shows validation errors when editing a user with empty fields", async () => {
    const handleSubmit = vi.fn();

    render(
      <UserModal
        isOpen={true}
        onClose={() => {}}
        onSubmit={handleSubmit}
        mode="edit"
        role="User"
        initialData={{
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
          location: "Mandaue City",
        }}
        existingEmails={["john@example.com"]}
      />
    );

    const firstNameInput = screen.getByPlaceholderText("First Name");
    const lastNameInput = screen.getByPlaceholderText("Last Name");
    const locationSelect = screen.getByLabelText("User Location");

    fireEvent.change(firstNameInput, { target: { value: "" } });
    fireEvent.change(lastNameInput, { target: { value: "" } });
    fireEvent.change(locationSelect, { target: { value: "" } });

    fireEvent.click(screen.getByRole("button", { name: /Update/i }));

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("First Name is required");
      expect(alert).toHaveTextContent("Last Name is required");
      expect(alert).toHaveTextContent("Location is required");
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
