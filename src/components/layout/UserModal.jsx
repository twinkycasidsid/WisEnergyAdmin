import React from "react";

function UserModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  mode = "create",
  role = "User", // passed from Users.jsx when adding
}) {
  if (!isOpen) return null;

  // Normalize role: prefer initialData.role when editing, otherwise use role prop
  const effectiveRole =
    mode === "edit"
      ? (initialData.role || "User").toLowerCase()
      : role.toLowerCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg p-6 z-10">
        {/* Header */}
        <h2 className="text-lg font-semibold mb-4">
          {mode === "edit"
            ? `Edit ${effectiveRole === "admin" ? "Admin" : "User"}`
            : `Create New ${effectiveRole === "admin" ? "Admin" : "User"}`}
        </h2>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            let formData = {};

            if (effectiveRole === "admin") {
              const password = e.target.password?.value;
              const confirmPassword = e.target.confirmPassword?.value;

              if (mode === "create" && password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
              }

              formData = {
                first_name: e.target.firstName.value,
                last_name: e.target.lastName.value,
                email: e.target.email.value,
                location: e.target.location.value,
                role: "admin",
                ...(password ? { password } : {}), // only include password if provided
              };
            } else {
              formData = {
                first_name: e.target.firstName.value,
                last_name: e.target.lastName.value,
                email: e.target.email.value,
                location: e.target.location.value,
                role: "user",
              };
            }

            onSubmit(formData);
          }}
          className="space-y-4"
        >
          {/* Shared Fields */}
          <div className="flex gap-3">
            <input
              type="text"
              name="firstName"
              defaultValue={initialData.first_name || ""}
              placeholder="First Name"
              className="w-1/2 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              name="lastName"
              defaultValue={initialData.last_name || ""}
              placeholder="Last Name"
              className="w-1/2 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <input
            type="email"
            name="email"
            defaultValue={initialData.email || ""}
            disabled={mode === "edit" ? true : false}
            placeholder="Email Address"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Fields for Admin */}
          {effectiveRole === "admin" && (
            <>
              {mode === "create" && (
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
              {mode === "edit" && (
                <p className="text-xs text-gray-500">
                  Leave password fields empty if you don’t want to change it.
                </p>
              )}
            </>
          )}

          {/* Location only for Users */}
          <select
            name="location"
            defaultValue={initialData.location || ""}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Location</option>
            <option value="Mandaue City">Mandaue City</option>
            <option value="Lapu-Lapu City">Lapu-Lapu City</option>
          </select>

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
