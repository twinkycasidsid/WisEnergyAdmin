// tests/ACCOUNTS_CASE080.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ConfirmModal from "../src/components/layout/ConfirmModal";

describe("Manage Accounts - CASE-080 Delete Confirmation", () => {
  it("should display confirmation modal when deleting an account", () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    const message = "Are you sure you want to delete John Doe?";

    render(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        message={message}
      />
    );

    expect(screen.getByText("Confirm Delete")).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalled();

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    expect(onConfirm).toHaveBeenCalled();
  });

  it("should not render modal when isOpen is false", () => {
    render(
      <ConfirmModal
        isOpen={false}
        onClose={() => {}}
        onConfirm={() => {}}
        message="Dummy"
      />
    );

    expect(screen.queryByText("Confirm Delete")).not.toBeInTheDocument();
  });
});
