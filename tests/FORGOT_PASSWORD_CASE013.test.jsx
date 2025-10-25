import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ForgotPassword from "../src/components/layout/ForgotPassword";
import { generate_otp } from "../services/apiService";
import { vi } from "vitest";

vi.mock("../services/apiService", () => ({
  generate_otp: vi.fn(),
}));

describe("Forgot Password Component - CASE-013 Unregistered Email", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays error "Email is not yet registered" for unregistered email', async () => {
    generate_otp.mockResolvedValueOnce({
      success: false,
      message: "Email is not yet registered",
    });

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/enter your email address/i);
    fireEvent.change(emailInput, { target: { value: "fake@example.com" } });

    const resetButton = screen.getByRole("button", { name: /reset password/i });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.getByText("Email is not yet registered")).toBeInTheDocument();
    });

    expect(generate_otp).toHaveBeenCalledWith("fake@example.com", false);
  });
});
