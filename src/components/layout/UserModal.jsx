// UserModal.jsx
import React, { useState } from "react";

function UserModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  mode = "create",
  role = "User",
  existingEmails = [],
}) {
  const [errors, setErrors] = useState([]);

  if (!isOpen) return null;

  const effectiveRole = mode === "edit" ? initialData.role || "User" : role;

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const firstName = data.get("firstName")?.trim();
    const lastName = data.get("lastName")?.trim();
    const email = data.get("email")?.trim();
    const location = data.get("location")?.trim();
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");

    let validationErrors = [];

    // Required fields
    if (!firstName) validationErrors.push("First Name is required");
    if (!lastName) validationErrors.push("Last Name is required");
    if (!email) validationErrors.push("Email is required");
    if (effectiveRole.toLowerCase() !== "admin" && !location)
      validationErrors.push("Location is required");

    // Admin password validation
    if (effectiveRole.toLowerCase() === "admin" && mode === "create") {
      if (!password) validationErrors.push("Password is required");
      if (password !== confirmPassword)
        validationErrors.push("Passwords do not match");
    }

    // Duplicate email check
    if (mode === "create" && existingEmails.includes(email?.toLowerCase())) {
      validationErrors.push("Email already exists");
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = {
      first_name: firstName,
      last_name: lastName,
      email,
      role: effectiveRole,
      ...(effectiveRole !== "admin" ? { location } : {}),
      ...(effectiveRole === "admin" && password ? { password } : {}),
    };

    onSubmit(formData);
    setErrors([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-full max-w-md rounded-xl shadow-lg p-6 z-10 animate-slide-in">
        <h2 className="text-xl font-bold mb-4 text-center">
          {mode === "edit"
            ? `Edit ${effectiveRole}`
            : `Create New ${effectiveRole}`}
        </h2>

        {errors.length > 0 && (
          <div
            role="alert"
            className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
          >
            <ul className="list-disc list-inside">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name fields */}
          <div className="flex gap-3">
            <input
              type="text"
              name="firstName"
              defaultValue={initialData.first_name || ""}
              placeholder="First Name"
              aria-label="First Name"
              className="w-1/2 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              name="lastName"
              defaultValue={initialData.last_name || ""}
              placeholder="Last Name"
              aria-label="Last Name"
              className="w-1/2 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Email */}
          <input
            type="email"
            name="email"
            defaultValue={initialData.email || ""}
            disabled={mode === "edit"}
            placeholder="Email Address"
            aria-label="Email Address"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Admin password fields */}
          {effectiveRole.toLowerCase() === "admin" && mode === "create" && (
            <>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </>
          )}

          {/* Location only for users */}
          {effectiveRole.toLowerCase() !== "admin" && (
            <select
              name="location"
              aria-label="User Location"
              defaultValue={initialData.location || ""}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Location</option>
              <option value="Mandaue City">Mandaue City</option>
              <option value="Lapu-Lapu City">Lapu-Lapu City</option>
            </select>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {mode === "edit" ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserModal;
