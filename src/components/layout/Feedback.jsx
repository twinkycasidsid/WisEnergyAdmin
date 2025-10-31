import React, { useEffect, useState } from "react";
import { Filter, RotateCcw, X } from "lucide-react";
import {
  fetchAllFeedbacks,
  updateFeedbackStatus,
} from "../../../services/apiService";
import { useSearch } from "../SearchContext";

function Feedback() {
  const { searchQuery } = useSearch();

  useEffect(() => {
    document.title = "Feedbacks | WisEnergy";
  }, []);

  const [feedback, setFeedback] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [dateModifiedFilter, setDateModifiedFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const truncateMessage = (text, maxLength = 40) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  const totalPages = Math.ceil(filteredFeedback.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFeedback = filteredFeedback.slice(startIndex, endIndex);

  const statusColors = {
    Open: "bg-blue-100 text-blue-600",
    Resolved: "bg-green-100 text-green-600",
    Reviewed: "bg-yellow-100 text-yellow-600",
    "In Progress": "bg-pink-100 text-pink-600",
  };

  // Fetch all feedback
  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const response = await fetchAllFeedbacks();
        const withModified = response.map((f) => ({
          ...f,
          date_modified: f.date_modified || "",
        }));
        setFeedback(withModified);
        setFilteredFeedback(withModified);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };
    loadFeedback();
  }, []);

  // Filtering logic
  useEffect(() => {
    let filtered = feedback;

    if (typeFilter) filtered = filtered.filter((f) => f.type === typeFilter);
    if (statusFilter)
      filtered = filtered.filter((f) => f.status === statusFilter);

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter((f) => {
        const date = new Date(f.date_created);
        return date.toDateString() === filterDate.toDateString();
      });
    }

    if (dateModifiedFilter) {
      const filterDate = new Date(dateModifiedFilter);
      filtered = filtered.filter((f) => {
        if (!f.date_modified) return false;
        const date = new Date(f.date_modified);
        return date.toDateString() === filterDate.toDateString();
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.id.toLowerCase().includes(q) ||
          f.type?.toLowerCase().includes(q) ||
          f.message?.toLowerCase().includes(q) ||
          f.email?.toLowerCase().includes(q) ||
          f.status?.toLowerCase().includes(q) ||
          f.date_created?.toLowerCase().includes(q) ||
          f.date_modified?.toLowerCase().includes(q)
      );
    }

    setFilteredFeedback(filtered);
    setCurrentPage(1);
  }, [
    feedback,
    typeFilter,
    statusFilter,
    dateFilter,
    dateModifiedFilter,
    searchQuery,
  ]);

  const handleResetFilters = () => {
    setTypeFilter("");
    setStatusFilter("");
    setDateFilter("");
    setDateModifiedFilter("");
    setFilteredFeedback(feedback);
  };

  const handleStatusChange = async (id, newStatus) => {
    const result = await updateFeedbackStatus(id, newStatus);
    if (result.success) {
      setFeedback((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
              ...f,
              status: newStatus,
              date_modified: new Date().toISOString().split("T")[0],
            }
            : f
        )
      );
    } else {
      console.error("Failed to update feedback status:", result.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Feedback</h1>

      {/* Filter bar */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow px-4 py-3 mb-6">
        <div className="flex items-center divide-x divide-gray-200">
          <div className="flex items-center gap-2 px-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter By</span>
          </div>

          {/* Type Filter */}
          <div className="px-4">
            <select
              aria-label="Type Filter"
              className="bg-transparent text-sm text-gray-700 focus:outline-none"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">Type</option>
              <option value="Bug Report">Bug Report</option>
              <option value="Suggestion">Suggestion</option>
              <option value="Question">Question</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="px-4">
            <select
              aria-label="Status Filter"
              className="bg-transparent text-sm text-gray-700 focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Status</option>
              <option value="Open">Open</option>
              <option value="Resolved">Resolved</option>
              <option value="Reviewed">Reviewed</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>

          {/* Date Created Filter */}
          <div className="px-4">
            <label
              aria-label="Date FilterFilter"
              htmlFor="dateCreated"
              className="font-semibold text-sm text-gray-700 mr-2"
            >
              Date Created
            </label>
            <input
              type="date"
              className="bg-transparent text-sm text-gray-700 focus:outline-none"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          {/* Date Modified Filter */}
          <div className="px-4">
            <label
              htmlFor="dateModified"
              className="font-semibold text-sm text-gray-700 mr-2"
            >
              Date Modified
            </label>
            <input
              type="date"
              id="dateModified"
              className="bg-transparent text-sm text-gray-700 focus:outline-none"
              value={dateModifiedFilter}
              onChange={(e) => setDateModifiedFilter(e.target.value)}
            />
          </div>

          {/* Reset Filter */}
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

      {/* Feedback Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-200 text-left text-gray-700">
              <th className="p-3">ID</th>
              <th className="p-3">Type</th>
              <th className="p-3">Message</th>
              <th className="p-3">Email</th>
              <th className="p-3">Date Created</th>
              <th className="p-3">Date Modified</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentFeedback.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No feedback found.
                </td>
              </tr>
            ) : (
              currentFeedback.map((f) => (
                <tr
                  key={f.id}
                  className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedFeedback(f);
                    setShowModal(true);
                  }}
                >
                  <td className="p-3">{f.id}</td>
                  <td className="p-3">{f.type}</td>
                  <td className="p-3">{truncateMessage(f.message)}</td>
                  <td className="p-3">{f.email}</td>
                  <td className="p-3">{f.date_created}</td>
                  <td className="p-3">{f.date_modified || "-"}</td>
                  <td className="p-3">
                    {(() => {
                      let allowedStatuses = [];

                      if (f.type === "Suggestion") {
                        allowedStatuses = ["Open", "Reviewed"];
                      } else if (
                        f.type === "Bug Report" ||
                        f.type === "Question"
                      ) {
                        allowedStatuses = ["Open", "Resolved", "In Progress"];
                      } else {
                        allowedStatuses = ["Open"];
                      }

                      const isStatusEditable = !(
                        f.status === "Resolved" || f.status === "Reviewed"
                      );

                      return (
                        <select
                          value={f.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleStatusChange(f.id, e.target.value)
                          }
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[f.status]
                            }`}
                          disabled={!isStatusEditable}
                        >
                          {allowedStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      );
                    })()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal (updated design) */}
      {showModal && selectedFeedback && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-[500px] rounded-xl shadow-lg p-6 relative"
          >
            {/* X button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4">Feedback Details</h2>

            <div className="space-y-2 text-sm">
              <p>
                <strong>ID:</strong> {selectedFeedback.id}
              </p>
              <p>
                <strong>Type:</strong> {selectedFeedback.type}
              </p>
              <p>
                <strong>Date Created:</strong> {selectedFeedback.date_created}
              </p>
              <p>
                <strong>Date Modified:</strong>{" "}
                {selectedFeedback.date_modified || "-"}
              </p>
              <p>
                <strong>Message:</strong>
              </p>
              <div className="border rounded-md bg-gray-50 p-3 h-40 overflow-y-auto text-gray-700">
                {selectedFeedback.message}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredFeedback.length > 0 && (
        <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
          <p>
            Showing {startIndex + 1}–
            {Math.min(endIndex, filteredFeedback.length)} of{" "}
            {filteredFeedback.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded ${currentPage === 1
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
              className={`px-3 py-1 border rounded ${currentPage === totalPages || totalPages === 0
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

export default Feedback;
