import React from "react"; 
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom"; 
import Login from "@src/components/Login"; 
import { login } from "@services/apiService"; 

vi.mock("@services/apiService", () => ({
  login: vi.fn(() =>
    Promise.resolve({ success: false, message: "Invalid email format" })
  ),
}));

describe("Login Component - CASE-006", () => {
  it("should show an error message for invalid email format", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText("Enter your email address");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "invalidemail@gf" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText("Invalid email format"))
    });
  });
});
