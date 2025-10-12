import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";
import { SearchProvider } from "../src/components/SearchContext";
import Users from "../src/components/layout/Users";
import Header from "../src/components/layout/Header";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { fetchAllUsers } from "../services/apiService";

vi.mock("../services/apiService", () => ({
  fetchAllUsers: vi.fn().mockResolvedValue([
    {
      uid: "1",
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      location: "Mandaue City",
      role: "user",
      created_at: "2025-10-12T00:00:00Z",
      updated_at: "2025-10-12T00:00:00Z",
    },
    {
      uid: "2",
      first_name: "Alice",
      last_name: "Smith",
      email: "alice@example.com",
      location: "Lapu-Lapu City",
      role: "user",
      created_at: "2025-10-12T00:00:00Z",
      updated_at: "2025-10-12T00:00:00Z",
    },
  ]),
  addNewUser: vi.fn(),
  updateUser: vi.fn(),
}));

test("displays 'No results found' for non-existent user search", async () => {
  render(
    <MemoryRouter>
      <SearchProvider>
        <Header />
        <Users />
      </SearchProvider>
    </MemoryRouter>
  );

  // Wait for initial users to render
  const johnRow = await screen.findByText("John");
  expect(johnRow).toBeInTheDocument();
  const aliceRow = await screen.findByText("Alice");
  expect(aliceRow).toBeInTheDocument();

  // Type a non-existent name into global search
  const searchInput = screen.getByPlaceholderText("Search");
  fireEvent.change(searchInput, { target: { value: "NonExistentUser" } });

  // Assert that the original users are no longer in the table
  expect(screen.queryByText("John")).not.toBeInTheDocument();
  expect(screen.queryByText("Alice")).not.toBeInTheDocument();

  // Check for "No results found" message
  const noResults = await screen.findByText(/No results found/i);
  expect(noResults).toBeInTheDocument();
});
