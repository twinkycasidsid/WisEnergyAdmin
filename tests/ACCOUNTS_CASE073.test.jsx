import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import UserModal from "../src/components/layout/UserModal";

describe("Manage Accounts - CASE-073", () => {
  it("shows error when Admin fields are missing", async () => {
    const handleSubmit = vi.fn();

    render(
      <UserModal
        isOpen={true}
        onClose={() => {}}
        onSubmit={handleSubmit}
        mode="create"
        role="Admin"
        existingEmails={[]}
      />
    );

    // Click create without filling any input
    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("First Name is required");
      expect(alert).toHaveTextContent("Last Name is required");
      expect(alert).toHaveTextContent("Email is required");
      expect(alert).toHaveTextContent("Password is required");
      expect(alert).toHaveTextContent("Confirm Password is required");
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
