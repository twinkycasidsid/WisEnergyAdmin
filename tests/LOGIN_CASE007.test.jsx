import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event'; // Vitest-compatible user simulation
// No need to import expect - it's global from Chai setup

// Adjust the import path to your actual Login component
import Login from '../src/components/Login'; // e.g., '../components/Login.jsx' - update as needed

describe('Login Component - CASE-007', () => {
  // Create a user instance for consistent testing (Vitest best practice)
  const user = userEvent.setup();

  it('should show an error message when email field is left empty on submit', async () => {
    // Render the Login component
    render(<Login />);

    // Find the inputs and submit button
    const emailInput = screen.getByPlaceholderText('Enter your email address');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i }); // Adjust name if button text differs (e.g., /login/i)

    // Assert email is empty initially (uses Chai's property check)
    expect(emailInput.value).to.equal(''); // Direct value assertion (works without extra plugins)

    // Fill password but leave email empty (simulate partial form fill)
    await user.type(passwordInput, 'password123');

    // Optional: If your component validates on blur, trigger it here
    // await user.click(document.body); // Or fireEvent.blur(emailInput) from '@testing-library/react'

    // Submit the form (triggers validation)
    await user.click(submitButton);

    // Wait for the error message to appear asynchronously (after validation runs)
    // Uses Chai's .to.exist matcher (from chai-dom)
    await waitFor(() => {
      expect(screen.getByText('Email field cannot be empty.')).to.exist;
    }, { timeout: 2000 }); // Adjust timeout if validation is slower (e.g., due to useEffect)

    // Optional: Assert the error is visible and styled (e.g., red text class)
    // const errorElement = screen.getByText('Email field cannot be empty.');
    // expect(errorElement).to.be.visible;
    // expect(errorElement).to.have.class('text-red-600'); // If using chai-dom

    // Optional: Assert login doesn't succeed (no success message or redirect)
    // expect(screen.queryByText(/welcome|dashboard/i)).not.to.exist;
  });
});
