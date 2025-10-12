import React, { useEffect, useState } from "react";
import { Filter, RotateCcw, X } from "lucide-react";
import { fetchAllReviews } from "../../../services/apiService";
import { useSearch } from "../SearchContext";

function Reviews() {
  const { searchQuery } = useSearch();
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [ratingFilter, setRatingFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [selectedReview, setSelectedReview] = useState(null);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const currentReviews = filteredReviews.slice(startIndex, endIndex);

  const renderStars = (count) => (
    <span className="text-yellow-500">
      {"★".repeat(count)}
      <span className="text-gray-300">{"★".repeat(5 - count)}</span>
    </span>
  );

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await fetchAllReviews();
        setReviews(response);
        setFilteredReviews(response);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    loadReviews();
  }, []);

  useEffect(() => {
    let filtered = reviews;

    if (ratingFilter) {
      const ratingValue = parseInt(ratingFilter[0], 10);
      filtered = filtered.filter((r) => r.rating === ratingValue);
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter((r) => {
        const date = new Date(r.created_at);
        return date.toDateString() === filterDate.toDateString();
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.message?.toLowerCase().includes(q) ||
          r.email?.toLowerCase().includes(q) ||
          String(r.rating).includes(q) ||
          r.created_at?.toLowerCase().includes(q)
      );
    }

    setFilteredReviews(filtered);
    setCurrentPage(1);
  }, [reviews, ratingFilter, dateFilter, searchQuery]);

  const handleResetFilters = () => {
    setRatingFilter("");
    setDateFilter("");
    setFilteredReviews(reviews);
  };

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-6">Reviews</h1>

      {/* Filter Bar */}
      <div className="flex items-center justify-between rounded-lg py-3 mb-6">
        <div className="flex items-center bg-white rounded-lg shadow px-4 py-3 divide-x divide-gray-200">
          <div className="flex items-center gap-2 px-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter By</span>
          </div>

          {/* Rating Filter */}
          <div className="px-4">
            <select
              className="bg-transparent text-sm text-gray-700 focus:outline-none"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="">Rating</option>
              <option value="5 Stars">5 Stars</option>
              <option value="4 Stars">4 Stars</option>
              <option value="3 Stars">3 Stars</option>
              <option value="2 Stars">2 Stars</option>
              <option value="1 Star">1 Star</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="px-4">
            <label
              htmlFor="dateCreated"
              className="font-semibold text-sm text-gray-700 mr-2"
            >
              Date Created
            </label>
            <input
              id="dateCreated"
              type="date"
              className="bg-transparent text-sm text-gray-700 focus:outline-none"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
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

      {/* Reviews Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-200 text-left text-gray-700">
              <th className="p-3">ID</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Message</th>
              <th className="p-3">Email</th>
              <th className="p-3">Date Created</th>
            </tr>
          </thead>
          <tbody>
            {currentReviews.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No results found.
                </td>
              </tr>
            ) : (
              currentReviews.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setSelectedReview(r)}
                  className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="p-3">{r.id}</td>
                  <td className="p-3">{renderStars(r.rating)}</td>
                  <td className="p-3 truncate max-w-xs">
                    {r.message.length > 40
                      ? `${r.message.slice(0, 40)}...`
                      : r.message}
                  </td>
                  <td className="p-3">{r.email}</td>
                  <td className="p-3">{r.created_at}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredReviews.length > 0 && (
        <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
          <p>
            Showing {startIndex + 1}–
            {Math.min(endIndex, filteredReviews.length)} of{" "}
            {filteredReviews.length}
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

      {/* Review Modal */}
      {selectedReview && (
        <div
          onClick={() => setSelectedReview(null)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
            className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative"
          >
            {/* X Button */}
            <button
              onClick={() => setSelectedReview(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold mb-3 text-gray-800">
              Review Details
            </h2>

            <p className="text-sm text-gray-600 mb-2">
              <strong>ID:</strong> {selectedReview.id}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Rating:</strong> {renderStars(selectedReview.rating)}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Email:</strong> {selectedReview.email}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Date:</strong> {selectedReview.created_at}
            </p>
            <p className="text-sm text-gray-700 mt-4 whitespace-pre-wrap">
              {selectedReview.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reviews;
