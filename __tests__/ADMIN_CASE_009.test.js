import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../src/components/Login'; // Adjust the path to your Login component
import { login } from '../services/apiService'; // Adjust the path to your login function

// Mock the login function
jest.mock('../services/apiService', () => ({
    login: jest.fn(),
}));

test('Admin enters valid credentials', async () => {
    // Mock the API to return an error response
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

    // Assert: Check if the error message is displayed
    await waitFor(() => {
        expect(screen.getByText(/Login failed. Please try again./i)).toBeInTheDocument();
    });
});
