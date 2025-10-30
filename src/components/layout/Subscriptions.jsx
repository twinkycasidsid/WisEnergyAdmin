import React, { useEffect, useState } from "react";
import { Filter, RotateCcw, X } from "lucide-react";
import { useSearch } from "../SearchContext";
import { fetchAllSubscriptions } from "../../../services/apiService";

function Subscriptions() {
  const { searchQuery } = useSearch();

  useEffect(() => {
    document.title = "Subscriptions | WisEnergy";
  }, []);

  const [subscriptions, setSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [planFilter, setPlanFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 7;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const currentSubscriptions = filteredSubscriptions.slice(startIndex, endIndex);

  // ✅ Fetch from backend
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const res = await fetchAllSubscriptions();
      if (res.success) {
        setSubscriptions(res.data);
        setFilteredSubscriptions(res.data);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // ✅ Filtering logic
  useEffect(() => {
    let filtered = subscriptions;

    if (planFilter) filtered = filtered.filter((s) => s.plan_type === planFilter);
    if (statusFilter) filtered = filtered.filter((s) => s.status === statusFilter);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.subscription_id.toLowerCase().includes(q) ||
          s.user_id.toLowerCase().includes(q) ||
          s.plan_type.toLowerCase().includes(q) ||
          s.status.toLowerCase().includes(q) ||
          (s.payment_reference && s.payment_reference.toLowerCase().includes(q))
      );
    }

    setFilteredSubscriptions(filtered);
    setCurrentPage(1);
  }, [subscriptions, planFilter, statusFilter, searchQuery]);

  const handleResetFilters = () => {
    setPlanFilter("");
    setStatusFilter("");
    setFilteredSubscriptions(subscriptions);
  };

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>

      {/* Filter Bar */}
      <div className="flex items-center justify-between rounded-lg py-3 mb-6">
        <div className="flex items-center bg-white rounded-lg shadow px-4 py-3 divide-x divide-gray-200">
          <div className="flex items-center gap-2 px-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter By</span>
          </div>

          {/* Plan Filter */}
          <div className="px-4">
            <select
              className="bg-transparent text-sm text-gray-700 focus:outline-none"
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
            >
              <option value="">Plan Type</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="px-4">
            <select
              className="bg-transparent text-sm text-gray-700 focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Pending">Pending</option>
            </select>
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

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {loading ? (
          <div className="text-center py-10 text-gray-500 text-sm">
            Loading subscriptions...
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-200 text-left text-gray-700">
                <th className="p-3">Subscription ID</th>
                <th className="p-3">User ID</th>
                <th className="p-3">Plan Type</th>
                <th className="p-3">Start Date</th>
                <th className="p-3">End Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment Reference</th>
              </tr>
            </thead>
            <tbody>
              {currentSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No subscriptions found.
                  </td>
                </tr>
              ) : (
                currentSubscriptions.map((s) => (
                  <tr
                    key={s.subscription_id}
                    onClick={() => setSelectedSubscription(s)}
                    className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="p-3">{s.subscription_id}</td>
                    <td className="p-3">{s.user_id}</td>
                    <td className="p-3">{s.plan_type}</td>
                    <td className="p-3">{s.start_date}</td>
                    <td className="p-3">{s.end_date || "—"}</td>
                    <td
                      className={`p-3 font-semibold ${s.status === "Active"
                          ? "text-green-600"
                          : s.status === "Expired"
                            ? "text-red-500"
                            : "text-yellow-500"
                        }`}
                    >
                      {s.status}
                    </td>
                    <td className="p-3">{s.payment_reference || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredSubscriptions.length > 0 && (
        <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
          <p>
            Showing {startIndex + 1}–
            {Math.min(endIndex, filteredSubscriptions.length)} of{" "}
            {filteredSubscriptions.length}
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

      {/* Modal */}
      {selectedSubscription && (
        <div
          onClick={() => setSelectedSubscription(null)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative"
          >
            <button
              onClick={() => setSelectedSubscription(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold mb-3 text-gray-800">
              Subscription Details
            </h2>

            <p className="text-sm text-gray-600 mb-2">
              <strong>ID:</strong> {selectedSubscription.subscription_id}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>User ID:</strong> {selectedSubscription.user_id}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Plan Type:</strong> {selectedSubscription.plan_type}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Status:</strong>{" "}
              <span
                className={`font-semibold ${selectedSubscription.status === "Active"
                    ? "text-green-600"
                    : selectedSubscription.status === "Expired"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
              >
                {selectedSubscription.status}
              </span>
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Start Date:</strong> {selectedSubscription.start_date}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>End Date:</strong> {selectedSubscription.end_date || "—"}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Payment Reference:</strong>{" "}
              {selectedSubscription.payment_reference || "—"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subscriptions;
