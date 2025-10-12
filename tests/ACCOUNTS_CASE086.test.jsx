import '@testing-library/jest-dom';
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { SearchProvider } from "../src/components/SearchContext";
import Reviews from "../src/components/layout/Reviews";

// Mock the API function
const mockReviews = [
  {
    id: "r1",
    rating: 5,
    message: "Excellent service!",
    email: "john@example.com",
    created_at: "2025-01-01",
  },
  {
    id: "r2",
    rating: 3,
    message: "Average experience.",
    email: "jane@example.com",
    created_at: "2025-01-02",
  },
  {
    id: "r3",
    rating: 4,
    message: "Good, but room for improvement.",
    email: "bob@example.com",
    created_at: "2025-01-03",
  },
];

vi.mock("../services/apiService", () => ({
  fetchAllReviews: vi.fn(() => Promise.resolve(mockReviews)),
}));

const renderWithProvider = (ui) => render(<SearchProvider>{ui}</SearchProvider>);

describe("Reviews Component - CASE-086 View Reviews", () => {
  it("displays all reviews with reviewer, rating, and date", async () => {
    renderWithProvider(<Reviews />);

    await waitFor(() => expect(screen.getByText("r1")).toBeInTheDocument());

    expect(screen.getByText("r1")).toBeInTheDocument();
    expect(screen.getByText("r2")).toBeInTheDocument();
    expect(screen.getByText("r3")).toBeInTheDocument();

    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();

    expect(screen.getByText("2025-01-01")).toBeInTheDocument();
    expect(screen.getByText("2025-01-02")).toBeInTheDocument();
    expect(screen.getByText("2025-01-03")).toBeInTheDocument();
  });
});
