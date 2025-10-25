import { vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchProvider } from "../src/components/SearchContext";
import Feedback from "../src/components/layout/Feedback";
import Header from "../src/components/layout/Header";
import "@testing-library/jest-dom";
import { fetchAllFeedbacks, updateFeedbackStatus } from "../services/apiService";
import { MemoryRouter } from "react-router-dom";

vi.mock("../services/apiService", () => ({
  fetchAllFeedbacks: vi.fn(),
  updateFeedbackStatus: vi.fn(),
}));

const renderWithProvider = (ui) => render(
  <MemoryRouter>
    <SearchProvider>
      <Header />
      {ui}
    </SearchProvider>
  </MemoryRouter>
);

describe("Feedback Component - CASE-097 Update Feedback Status", () => {
  const mockFeedback = [
    { id: "f1", type: "Bug Report", message: "App crashes on login", email: "john@example.com", status: "Open", dateModified: "2025-01-01" },
    { id: "f2", type: "Suggestion", message: "Add dark mode", email: "alice@example.com", status: "Reviewed", dateModified: "2025-01-03" },
  ];

  beforeEach(() => {
    fetchAllFeedbacks.mockResolvedValue(mockFeedback);
    updateFeedbackStatus.mockResolvedValue({ success: true, dateModified: "2025-10-12" });
    vi.clearAllMocks();
  });

  it('updates status and auto-updates Date Modified', async () => {
    renderWithProvider(<Feedback />);

    await waitFor(() => {
      expect(screen.getByText("f1")).toBeInTheDocument();
      expect(screen.getByText("f2")).toBeInTheDocument();
    });

    const firstRow = screen.getByText("f1").closest("tr");
    const statusSelect = within(firstRow).getByRole("combobox");

    userEvent.selectOptions(statusSelect, "Resolved");

    await waitFor(() => {
      expect(updateFeedbackStatus).toHaveBeenCalledWith("f1", "Resolved");

      const dateModifiedCell = within(firstRow).getAllByRole("cell")[5]; 
      expect(dateModifiedCell).toHaveTextContent("2025-10-12");
    });
  });
});
