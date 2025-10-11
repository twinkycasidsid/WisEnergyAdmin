import React, { useState, useEffect } from "react";
import { Filter, RotateCcw } from "lucide-react";
import { fetchAllDevices } from "../../../services/apiService";
import { useSearch } from "../SearchContext"; // adjust path if deeper

function Devices() {
  const { searchQuery } = useSearch();
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);
  const currentDevices = filteredDevices.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchDevicesData = async () => {
      try {
        const response = await fetchAllDevices();
        setDevices(response);
        setFilteredDevices(response);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevicesData();
  }, []);

  useEffect(() => {
    let filtered = devices;

    if (statusFilter) {
      filtered = filtered.filter((d) => d.status === statusFilter);
    }

    if (startDateFilter && endDateFilter) {
      const start = new Date(startDateFilter);
      const end = new Date(endDateFilter);
      filtered = filtered.filter((d) => {
        const date = new Date(d.register_at?.split("T")[0]);
        return date >= start && date <= end;
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.id?.toLowerCase().includes(q) ||
          d.device_nickname?.toLowerCase().includes(q) ||
          d.owner?.toLowerCase().includes(q) ||
          d.pairing_code?.toLowerCase().includes(q) ||
          d.status?.toLowerCase().includes(q)
      );
    }

    setFilteredDevices(filtered);
    setCurrentPage(1); // reset to first page when filters/search change
  }, [devices, statusFilter, startDateFilter, endDateFilter, searchQuery]);

  const handleResetFilters = () => {
    setStatusFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits for month
    const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits for day
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Devices</h1>

      {/* Filter bar */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow px-4 py-3 mb-6">
        <div className="flex items-center divide-x divide-gray-200">
          <div className="flex items-center gap-2 px-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter By</span>
          </div>

          <div className="px-4">
            <select
              className="bg-transparent text-sm text-gray-700 focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Status</option>
              <option value="paired">Paired</option>
              <option value="unpaired">Unpaired</option>
            </select>
          </div>

          <div className="px-2">
            <label
              htmlFor="startDate"
              className="font-semibold text-sm text-gray-700 mr-2"
            >
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              className="bg-transparent text-sm text-gray-700 focus:outline-none"
            />
          </div>

          <div className="px-2">
            <label
              htmlFor="endDate"
              className="font-semibold text-sm text-gray-700 mr-2"
            >
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
              className="bg-transparent text-sm text-gray-700 focus:outline-none"
            />
          </div>

          <div className="px-4">
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Filter
            </button>
          </div>
        </div>
      </div>

      {/* Devices Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {filteredDevices.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No devices found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-200 text-left text-gray-700">
                <th className="p-3">ID</th>
                <th className="p-3">Device Name</th>
                <th className="p-3">Owner</th>
                <th className="p-3">Pairing Code</th>
                <th className="p-3">Paired At</th>
                <th className="p-3">Registered At</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentDevices.map((d, index) => (
                <tr
                  key={d.device_id || index}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3">{d.id}</td>
                  <td className="p-3">{d.device_nickname}</td>
                  <td className="p-3">{d.owner}</td>
                  <td className="p-3">{d.pairing_code}</td>
                  {/* Format paired_at and register_at to show only the date */}
                  <td className="p-3">{formatDate(d.paired_at)}</td>
                  <td className="p-3">{formatDate(d.register_at)}</td>
                  <td className="p-3 capitalize">{d.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination - outside white container */}
      {filteredDevices.length > 0 && (
        <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
          <p>
            Showing {startIndex + 1}–{Math.min(endIndex, filteredDevices.length)} of{" "}
            {filteredDevices.length}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              &lt;
            </button>
            <span>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() =>
                setCurrentPage((p) => (p < totalPages ? p + 1 : p))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-1 border rounded ${
                currentPage === totalPages || totalPages === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Devices;
