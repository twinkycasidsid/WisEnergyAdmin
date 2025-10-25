import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("../services/apiService", () => ({
  fetchAllUsers: vi.fn().mockResolvedValue([]),
  fetchAllDevices: vi.fn().mockResolvedValue([]),
  fetchAllFeedbacks: vi.fn().mockResolvedValue([]),
  fetchAllReviews: vi.fn().mockResolvedValue([]),
}));

vi.mock("../services/exportUtils", () => ({
  exportToPDF: vi.fn(),
  exportToDOCX: vi.fn(),
}));

vi.mock("../public/assets/template", () => ({
  __esModule: true,
  default: () => <div id="report-template">Mock Report Template</div>,
}));

import { exportToPDF, exportToDOCX } from "../services/exportUtils";
import Exports from "../src/components/layout/Exports";

describe("Generate Reports - CASE-109 Export as DOCX", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls exportToDOCX when admin exports report as DOCX", async () => {
    render(<Exports />);

    await waitFor(() =>
      expect(screen.getByText("Export Reports")).toBeInTheDocument()
    );

    const fileTypeSelect = screen.getByLabelText(/choose file type/i);
    fireEvent.change(fileTypeSelect, { target: { value: "docx" } });
    expect(fileTypeSelect.value).toBe("docx");

    const exportBtn = screen.getByRole("button", { name: /export/i });
    fireEvent.click(exportBtn);

    await waitFor(() => {
      expect(exportToDOCX).toHaveBeenCalledTimes(1);
      expect(exportToPDF).not.toHaveBeenCalled();
    });
  });
});
