import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchProvider } from "../src/components/SearchContext";
import Feedback from "../src/components/layout/Feedback";
import Header from "../src/components/layout/Header";
import "@testing-library/jest-dom";
import { fetchAllFeedbacks } from "../services/apiService";
import { MemoryRouter } from "react-router-dom";

vi.mock("../services/apiService", () => ({
  fetchAllFeedbacks: vi.fn(),
}));

const renderWithProvider = (ui) => render(
  <MemoryRouter>
    <SearchProvider>
      <Header />
      {ui}
    </SearchProvider>
  </MemoryRouter>
);

describe("Feedback Component - CASE-095 Search Feedback", () => {
  const mockFeedback = [
    { id: "f1", type: "Bug Report", message: "App crashes on login", email: "john@example.com" },
    { id: "f2", type: "Suggestion", message: "Add dark mode", email: "alice@example.com" },
    { id: "f3", type: "Question", message: "How to reset password?", email: "bob@example.com" },
  ];

  beforeEach(() => {
    fetchAllFeedbacks.mockResolvedValue(mockFeedback);
    vi.clearAllMocks();
  });

  it("filters feedback by ID, keyword, or email", async () => {
    renderWithProvider(<Feedback />);

    await waitFor(() => {
      expect(screen.getByText("f1")).toBeInTheDocument();
      expect(screen.getByText("f2")).toBeInTheDocument();
      expect(screen.getByText("f3")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search"); 

    await userEvent.type(searchInput, "f1");
    await waitFor(() => {
      expect(screen.getByText("f1")).toBeInTheDocument();
      expect(screen.queryByText("f2")).not.toBeInTheDocument();
      expect(screen.queryByText("f3")).not.toBeInTheDocument();
    });

    await userEvent.clear(searchInput);

    await userEvent.type(searchInput, "dark mode");
    await waitFor(() => {
      expect(screen.getByText("f2")).toBeInTheDocument();
      expect(screen.queryByText("f1")).not.toBeInTheDocument();
      expect(screen.queryByText("f3")).not.toBeInTheDocument();
    });

    await userEvent.clear(searchInput);

    // Search by email
    await userEvent.type(searchInput, "bob@example.com");
    await waitFor(() => {
      expect(screen.getByText("f3")).toBeInTheDocument();
      expect(screen.queryByText("f1")).not.toBeInTheDocument();
      expect(screen.queryByText("f2")).not.toBeInTheDocument();
    });
  });
});
