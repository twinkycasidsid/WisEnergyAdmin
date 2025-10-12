import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import { vi } from "vitest";
import { SearchProvider } from "../src/components/SearchContext";
import Feedback from "../src/components/layout/Feedback";

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

const renderWithProvider = (ui) =>
  render(<SearchProvider>{ui}</SearchProvider>);

describe("Feedback Component - CASE-092 View Feedback", () => {
  it("displays all feedback entries with ID, Type, Email, Dates, and Status", async () => {
    renderWithProvider(<Feedback />);

    await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument());

    const tableBodies = screen.getAllByRole("rowgroup"); 
    const tableBody = tableBodies[0]; 
    const rows = within(tableBody).getAllByRole("row");

    // First row
    const firstRowCells = within(rows[0]).getAllByRole("cell");
    expect(firstRowCells[0]).toHaveTextContent("f1");
    expect(firstRowCells[1]).toHaveTextContent("Bug Report");
    expect(firstRowCells[3]).toHaveTextContent("john@example.com");
    expect(firstRowCells[4]).toHaveTextContent("2025-01-01");
    expect(firstRowCells[5]).toHaveTextContent("2025-01-02");

    // Get the select inside the status cell
    const firstRowStatusSelect = within(firstRowCells[6]).getByRole("combobox");
    expect(firstRowStatusSelect).toHaveValue("Open");

    // Second row
    const secondRowCells = within(rows[1]).getAllByRole("cell");
    expect(secondRowCells[0]).toHaveTextContent("f2");
    expect(secondRowCells[1]).toHaveTextContent("Suggestion");
    expect(secondRowCells[3]).toHaveTextContent("alice@example.com");
    expect(secondRowCells[4]).toHaveTextContent("2025-01-03");
    expect(secondRowCells[5]).toHaveTextContent("-");

    const secondRowStatusSelect = within(secondRowCells[6]).getByRole(
      "combobox"
    );
    expect(secondRowStatusSelect).toHaveValue("Reviewed");

    // Third row
    const thirdRowCells = within(rows[2]).getAllByRole("cell");
    expect(thirdRowCells[0]).toHaveTextContent("f3");
    expect(thirdRowCells[1]).toHaveTextContent("Question");
    expect(thirdRowCells[3]).toHaveTextContent("bob@example.com");
    expect(thirdRowCells[4]).toHaveTextContent("2025-01-04");
    expect(thirdRowCells[5]).toHaveTextContent("-");

    const thirdRowStatusSelect = within(thirdRowCells[6]).getByRole("combobox");
    expect(thirdRowStatusSelect).toHaveValue("Open");
  });
});
