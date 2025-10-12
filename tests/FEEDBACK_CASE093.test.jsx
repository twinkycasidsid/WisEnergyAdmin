import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { SearchProvider } from "../src/components/SearchContext";
import Feedback from "../src/components/layout/Feedback";

// Mock API service
const mockFeedback = [
  {
    id: "f1",
    type: "Bug Report",
    message: "App crashes on login",
    email: "john@example.com",
    date_created: "2025-01-01",
    date_modified: "2025-01-02",
    status: "Open",
  },
  {
    id: "f2",
    type: "Suggestion",
    message: "Add dark mode",
    email: "alice@example.com",
    date_created: "2025-01-03",
    date_modified: "",
    status: "Reviewed",
  },
  {
    id: "f3",
    type: "Question",
    message: "How to reset password?",
    email: "bob@example.com",
    date_created: "2025-01-04",
    date_modified: "",
    status: "Open",
  },
];

vi.mock("../services/apiService", () => ({
  fetchAllFeedbacks: vi.fn(() => Promise.resolve(mockFeedback)),
  updateFeedbackStatus: vi.fn(() => Promise.resolve({ success: true })),
}));

const renderWithProvider = (ui) => render(<SearchProvider>{ui}</SearchProvider>);

describe("Feedback Component - CASE-093 Filter Feedback", () => {
  it("resets all filters", async () => {
    renderWithProvider(<Feedback />);

    const typeFilter = screen.getByRole("combobox", { name: "Type Filter" });
    await userEvent.selectOptions(typeFilter, "Bug Report");

    const resetButton = screen.getByText("Reset Filter");
    await userEvent.click(resetButton);

    const rows = await screen.findAllByRole("row");
    const dataRows = rows.filter(row => within(row).queryAllByRole("cell").length > 0);

    const ids = dataRows.map(row => within(row).getAllByRole("cell")[0].textContent);
    expect(ids).toEqual(["f1", "f2", "f3"]);

    const types = dataRows.map(row => within(row).getAllByRole("cell")[1].textContent);
    expect(types).toEqual(["Bug Report", "Suggestion", "Question"]);

    const emails = dataRows.map(row => within(row).getAllByRole("cell")[3].textContent);
    expect(emails).toEqual(["john@example.com", "alice@example.com", "bob@example.com"]);
  });
});
