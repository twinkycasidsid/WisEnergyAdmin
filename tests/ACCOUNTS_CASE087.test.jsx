import '@testing-library/jest-dom';
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import Reviews from "../src/components/layout/Reviews";
import { SearchProvider } from "../src/components/SearchContext";

// Mock API
const mockReviews = [
  { id: "r1", rating: 5, message: "Excellent service!", email: "john@example.com", created_at: "2025-01-01" },
  { id: "r2", rating: 3, message: "Average experience.", email: "jane@example.com", created_at: "2025-01-02" },
  { id: "r3", rating: 4, message: "Good, but room for improvement.", email: "bob@example.com", created_at: "2025-01-03" },
];

vi.mock("../services/apiService", () => ({
  fetchAllReviews: vi.fn(() => Promise.resolve(mockReviews)),
}));

const renderWithProvider = (ui) => render(<SearchProvider>{ui}</SearchProvider>);

describe("Reviews Component - CASE-087 Filter Reviews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("filters reviews by rating", async () => {
    renderWithProvider(<Reviews />);

    await waitFor(() => expect(screen.getByText("r1")).toBeInTheDocument());

    const ratingFilter = screen.getByRole("combobox");
    await userEvent.selectOptions(ratingFilter, "5 Stars");

    await waitFor(() => {
      expect(screen.getByText("r1")).toBeInTheDocument();
      expect(screen.queryByText("r2")).not.toBeInTheDocument();
      expect(screen.queryByText("r3")).not.toBeInTheDocument();
    });
  });

  it("filters reviews by date created", async () => {
    renderWithProvider(<Reviews />);

    await waitFor(() => expect(screen.getByText("r1")).toBeInTheDocument());

    const dateInput = screen.getByLabelText("Date Created");
    await userEvent.type(dateInput, "2025-01-02");

    await waitFor(() => {
      expect(screen.getByText("r2")).toBeInTheDocument();
      expect(screen.queryByText("r1")).not.toBeInTheDocument();
      expect(screen.queryByText("r3")).not.toBeInTheDocument();
    });
  });
});
