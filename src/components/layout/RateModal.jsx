import React, { useState, useEffect } from "react";

function RateModal({ isOpen, onClose, onSubmit, initialData, mode }) {
  const [formData, setFormData] = useState({
    city: "",
    month: "",
    rate: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ city: "", month: "", rate: "" });
    }
  }, [initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-10">
        <h2 className="text-xl font-bold mb-4">
          {mode === "edit" ? "Edit Rate" : "Add New Rate"}
        </h2>

        {/* City */}
        <div className="mb-4">
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            City
          </label>
          <select
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select City</option>
            <option value="Mandaue City">Mandaue City</option>
            <option value="Lapu-Lapu City">Lapu-Lapu City</option>
          </select>
        </div>

        {/* Month */}
        <div className="mb-4">
          <label htmlFor="month" className="block text-sm font-medium mb-1">
            Month
          </label>
          <input
            id="month"
            type="month"
            className="w-full border rounded px-3 py-2"
            value={formData.month}
            onChange={(e) =>
              setFormData({ ...formData, month: e.target.value })
            }
          />
        </div>

        {/* Rate */}
        <div className="mb-4">
          <label htmlFor="rate" className="block text-sm font-medium mb-1">
            Rate (₱/kWh)
          </label>
          <input
            id="rate"
            type="number"
            step="0.01"
            value={formData.rate}
            onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(formData)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {mode === "edit" ? "Save Changes" : "Add Rate"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RateModal;
