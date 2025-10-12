import '@testing-library/jest-dom';
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import Reviews from "../src/components/layout/Reviews";
import { fetchAllReviews } from "../services/apiService";
import { SearchProvider } from "../src/components/SearchContext";

// Mock the fetchAllReviews function
vi.mock("../services/apiService", () => ({
  fetchAllReviews: vi.fn(),
}));

const renderWithProvider = (ui) => render(<SearchProvider>{ui}</SearchProvider>);

describe("Reviews Component - CASE-089 Reset Filter", () => {
  const mockReviews = [
    {
      id: "r1",
      rating: 5,
      message: "Excellent service!",
      email: "john@example.com",
      created_at: "2025-01-01T10:00:00Z",
    },
    {
      id: "r2",
      rating: 3,
      message: "Average experience.",
      email: "jane@example.com",
      created_at: "2025-01-02T12:00:00Z",
    },
    {
      id: "r3",
      rating: 5,
      message: "Loved it!",
      email: "john@example.com",
      created_at: "2025-01-03T14:00:00Z",
    },
  ];

  beforeEach(() => {
    fetchAllReviews.mockResolvedValue(mockReviews);
    vi.clearAllMocks();
  });

  it("restores full review list after clicking Reset Filter", async () => {
    renderWithProvider(<Reviews />);

    const ratingFilter = screen.getByRole("combobox");
    await userEvent.selectOptions(ratingFilter, "5 Stars");

    const dateInput = screen.getByLabelText("Date Created");
    await userEvent.type(dateInput, "2025-01-01");

    await waitFor(() => {
      expect(screen.getByText("r1")).toBeInTheDocument();
      expect(screen.queryByText("r2")).not.toBeInTheDocument();
      expect(screen.queryByText("r3")).not.toBeInTheDocument();
    });

    const resetButton = screen.getByText("Reset Filter");
    await userEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.getByText("r1")).toBeInTheDocument();
      expect(screen.getByText("r2")).toBeInTheDocument();
      expect(screen.getByText("r3")).toBeInTheDocument();
    });
  });
});
