import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchProvider } from "../src/components/SearchContext";
import Reviews from "../src/components/layout/Reviews";
import Header from "../src/components/layout/Header";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { fetchAllReviews } from "../services/apiService";

vi.mock("../services/apiService", () => ({
  fetchAllReviews: vi.fn().mockResolvedValue([
    { id: "r1", rating: 5, message: "Great!", email: "user1@example.com", created_at: "2025-01-01" },
  ]),
}));

test("shows 'No results found' for non-existent review search", async () => {
  render(
    <MemoryRouter>
      <SearchProvider>
        <Header />
        <Reviews />
      </SearchProvider>
    </MemoryRouter>
  );

const searchInput = screen.getByPlaceholderText("Search");
  await userEvent.type(searchInput, "nonexistent");

  const noResults = await screen.findByText(/No results found/i);
  expect(noResults).toBeInTheDocument();
});
