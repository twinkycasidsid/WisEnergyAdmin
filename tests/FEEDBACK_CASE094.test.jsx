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
  {
    id: "f4",
    type: "Bug Report",
    message: "Error on saving settings",
    email: "carol@example.com",
    date_created: "2025-01-02",
    date_modified: "",
    status: "Resolved",
  },
];

vi.mock("../services/apiService", () => ({
  fetchAllFeedbacks: vi.fn(() => Promise.resolve(mockFeedback)),
  updateFeedbackStatus: vi.fn(() => Promise.resolve({ success: true })),
}));

const renderWithProvider = (ui) => render(<SearchProvider>{ui}</SearchProvider>);

describe("Feedback Component - CASE-094 Multiple Filters", () => {
  it("applies combined filters correctly", async () => {
    renderWithProvider(<Feedback />);

    const typeFilter = screen.getByRole("combobox", { name: "Type Filter" });
    await userEvent.selectOptions(typeFilter, "Bug Report");

    const statusFilter = screen.getByRole("combobox", { name: "Status Filter" });
    await userEvent.selectOptions(statusFilter, "Open");

    const dateInput = screen.getByLabelText("Date FilterFilter");
    await userEvent.type(dateInput, "2025-01-01");

    const rows = await screen.findAllByRole("row");
    const dataRows = rows.filter(row => within(row).queryAllByRole("cell").length > 0);

    expect(dataRows).toHaveLength(1);

    const rowCells = within(dataRows[0]).getAllByRole("cell");
    expect(rowCells[0]).toHaveTextContent("f1"); 
    expect(rowCells[1]).toHaveTextContent("Bug Report"); 
    expect(rowCells[3]).toHaveTextContent("john@example.com"); 
    expect(rowCells[4]).toHaveTextContent("2025-01-01"); 
    expect(rowCells[6]).toHaveTextContent("Open"); 
  });
});
