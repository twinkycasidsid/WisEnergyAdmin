import React from 'react'; // Import React for JSX
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../src/components/Login'; // Adjust the path to your Login component
import { login } from '../services/apiService'; // Mocking the login API

// Mock the login function
jest.mock('../services/apiService', () => ({
    login: jest.fn(),
}));

test('Admin leaves password field empty', async () => {
    // Mock the API to return an error response (login failure)
    login.mockResolvedValueOnce({ success: false, message: 'Login failed. Please try again.' });

    render(
        <Router>
            <Login />
        </Router>
    );

    // Simulate entering a valid email and leaving the password field empty
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'validemail@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: '' } });

    // Submit the form
    fireEvent.click(screen.getByText(/sign in/i));

    // Assert: Check if the error message for the password is displayed
    await waitFor(() => {
        expect(screen.getByText(/Password field cannot be empty./i)).toBeInTheDocument();
    });
});
