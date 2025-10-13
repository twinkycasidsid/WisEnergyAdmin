import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchProvider } from "../src/components/SearchContext";
import Reviews from "../src/components/layout/Reviews";
import "@testing-library/jest-dom";
import { fetchAllReviews } from "../services/apiService";
import Header from "../src/components/layout/Header";
import { MemoryRouter } from "react-router-dom";

vi.mock("../services/apiService", () => ({
  fetchAllReviews: vi.fn(),
}));

const renderWithProvider = (ui) => render(
  <MemoryRouter>
    <SearchProvider>
      <Header />     
      <Reviews />
    </SearchProvider>
  </MemoryRouter>
);

describe("Reviews Component - CASE-090 Search Reviews", () => {
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
      email: "alice@example.com",
      created_at: "2025-01-02T12:00:00Z",
    },
    {
      id: "r3",
      rating: 4,
      message: "Good support",
      email: "john@example.com",
      created_at: "2025-01-03T14:00:00Z",
    },
  ];

  beforeEach(() => {
    fetchAllReviews.mockResolvedValue(mockReviews);
    vi.clearAllMocks();
  });

  it("filters reviews by ID, keyword, or email", async () => {
    renderWithProvider(<Reviews />);

    await waitFor(() => {
      expect(screen.getByText("r1")).toBeInTheDocument();
      expect(screen.getByText("r2")).toBeInTheDocument();
      expect(screen.getByText("r3")).toBeInTheDocument();
    });

    const searchInput = screen.getByRole("textbox");

    await userEvent.type(searchInput, "r1");
    await waitFor(() => {
      expect(screen.getByText("r1")).toBeInTheDocument();
      expect(screen.queryByText("r2")).not.toBeInTheDocument();
      expect(screen.queryByText("r3")).not.toBeInTheDocument();
    });

    await userEvent.clear(searchInput);

    await userEvent.type(searchInput, "support");
    await waitFor(() => {
      expect(screen.getByText("r3")).toBeInTheDocument();
      expect(screen.queryByText("r1")).not.toBeInTheDocument();
      expect(screen.queryByText("r2")).not.toBeInTheDocument();
    });

    // Clear search
    await userEvent.clear(searchInput);

    // Search by email
    await userEvent.type(searchInput, "alice@example.com");
    await waitFor(() => {
      expect(screen.getByText("r2")).toBeInTheDocument();
      expect(screen.queryByText("r1")).not.toBeInTheDocument();
      expect(screen.queryByText("r3")).not.toBeInTheDocument();
    });
  });
});
