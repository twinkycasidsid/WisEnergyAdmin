import React from 'react'; // Add this line
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../src/components/Login"; // Update the path to the Login component
import { BrowserRouter as Router } from "react-router-dom";

// Mock the login function
jest.mock("../services/apiService.js", () => ({
    login: jest.fn(),
}));

test("Admin leaves email field empty", async () => {
    // Arrange
    const { login } = require("../services/apiService");
    login.mockResolvedValue({ success: false, message: "Email field cannot be empty" });

    render(
        <Router>
            <Login />
        </Router>
    );

    // Act: Enter empty email and valid password
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "validpassword" } });

    // Submit form
    fireEvent.click(screen.getByText(/sign in/i));

    // Assert: Error message for empty email field should be shown
    await waitFor(() => {
        expect(screen.getByText(/email field cannot be empty/i)).toBeInTheDocument();
    });
});
