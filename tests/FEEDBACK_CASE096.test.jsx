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

describe("Feedback Component - CASE-096 Reset Filter", () => {
  const mockFeedback = [
    { id: "f1", type: "Bug Report", message: "App crashes on login", email: "john@example.com" },
    { id: "f2", type: "Suggestion", message: "Add dark mode", email: "alice@example.com" },
    { id: "f3", type: "Question", message: "How to reset password?", email: "bob@example.com" },
  ];

  beforeEach(() => {
    fetchAllFeedbacks.mockResolvedValue(mockFeedback);
    vi.clearAllMocks();
  });

  it('clears filters and restores full feedback list', async () => {
    renderWithProvider(<Feedback />);

    await waitFor(() => {
      expect(screen.getByText("f1")).toBeInTheDocument();
      expect(screen.getByText("f2")).toBeInTheDocument();
      expect(screen.getByText("f3")).toBeInTheDocument();
    });

    const typeFilter = screen.getByLabelText("Type Filter");
    const statusFilter = screen.getByLabelText("Status Filter");
    const resetButton = screen.getByRole("button", { name: /Reset Filter/i });

    userEvent.selectOptions(typeFilter, "Bug Report");
    userEvent.selectOptions(statusFilter, "Open");

    await waitFor(() => {
      expect(screen.getByText("f1")).toBeInTheDocument();
      expect(screen.queryByText("f2")).not.toBeInTheDocument();
      expect(screen.queryByText("f3")).not.toBeInTheDocument();
    });

    userEvent.click(resetButton);

    await waitFor(() => {

      expect(screen.getByText("f1")).toBeInTheDocument();
      expect(screen.getByText("f2")).toBeInTheDocument();
      expect(screen.getByText("f3")).toBeInTheDocument();
    });
  });
});
