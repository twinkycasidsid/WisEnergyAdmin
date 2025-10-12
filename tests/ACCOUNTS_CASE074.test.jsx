import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
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

test("renders users table after fetch resolves", async () => {
  render(
    <MemoryRouter>
      <SearchProvider>
        <Header />
        <Users />
      </SearchProvider>
    </MemoryRouter>
  );

  const johnRow = await screen.findByText("John");
  expect(johnRow).toBeInTheDocument();

  const aliceRow = await screen.findByText("Alice");
  expect(aliceRow).toBeInTheDocument();
});
