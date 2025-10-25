import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForgotPassword from "../src/components/layout/ForgotPassword";
import { generate_otp } from "../services/apiService";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// Mock API
vi.mock("../services/apiService", () => ({
  generate_otp: vi.fn(),
}));

// Mock react-router-dom useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("ForgotPassword Component - CASE-014 Valid Registered Email", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends OTP and navigates to Code Verification", async () => {
    generate_otp.mockResolvedValue({ success: true });

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText("Enter your email address");
    const resetButton = screen.getByRole("button", { name: /reset password/i });

    await userEvent.type(emailInput, "john@example.com");
    await userEvent.click(resetButton);

    await waitFor(() => {
      expect(generate_otp).toHaveBeenCalledWith("john@example.com", false);
      expect(mockNavigate).toHaveBeenCalledWith("/code-verification", {
        state: { email: "john@example.com" },
      });
    });
  });
});
