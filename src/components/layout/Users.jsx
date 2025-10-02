import React, { useEffect, useState } from "react";
import { Filter, RotateCcw, Plus, Edit2, Trash2 } from "lucide-react";
import UserModal from "./UserModal";
import { addNewUser, fetchAllUsers, updateUser } from "../../../services/apiService";
import { useSearch } from "../SearchContext";
import ConfirmModal from "./ConfirmModal";

function Users() {
  const { searchQuery } = useSearch();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [newRole, setNewRole] = useState("User"); // default for Add
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // User data and filtered users
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Slice the filtered users to show only the current page
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Total number of pages
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  // Filter states
  const [locationFilter, setLocationFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState(""); // Start date filter
  const [endDateFilter, setEndDateFilter] = useState(""); // End date filter

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };
  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      const result = await fetchAllUsers();

      setUsers(result);
      setFilteredUsers(result); // Initialize filtered users with all users
    };
    fetchUsers();
  }, []);

  // Handle filtering logic
  useEffect(() => {
    let filtered = users;

    // Existing filters (location, role, dates)...
    if (locationFilter) {
      filtered = filtered.filter((u) => u.location === locationFilter);
    }
    if (roleFilter) {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }
    if (startDateFilter && endDateFilter) {
      const start = new Date(startDateFilter);
      const end = new Date(endDateFilter);
      filtered = filtered.filter((u) => {
        const date = new Date(u.created_at?.split("T")[0]);
        return date >= start && date <= end;
      });
    }

    // 🔍 Global search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.uid?.toLowerCase().includes(q) ||
          u.first_name?.toLowerCase().includes(q) ||
          u.last_name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.location?.toLowerCase().includes(q) ||
          u.role?.toLowerCase().includes(q) ||
          u.created_at?.toLowerCase().includes(q)
      );
    }

    setFilteredUsers(filtered);
  }, [
    users,
    locationFilter,
    roleFilter,
    startDateFilter,
    endDateFilter,
    searchQuery,
  ]);

  const handleAdd = (role = "User") => {
    setEditUser(null); // no initial data
    setNewRole(role); // preset role
    setShowUserModal(true);
    setShowAddMenu(false);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setLocationFilter("");
    setRoleFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
  };

  return (
    <>
      {/* Modal */}
      <UserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSubmit={async (formData) => {
          if (editUser) {
            // 🔹 Call API to update existing user
            const result = await updateUser(editUser.uid, {
              ...formData,
              role: newRole.toLowerCase(),
            });

            if (result.success) {
              // update local state so UI reflects changes
              setUsers((prev) =>
                prev.map((u) =>
                  u.uid === editUser.uid ? { ...u, ...formData, role: newRole.toLowerCase() } : u
                )
              );
            } else {
              console.error("❌ Failed to update user:", result.message);
            }
          } else {
            // 🔹 Creating new user
            console.log(formData);

            const result = await addNewUser({
              ...formData,
            });
            console.log(result);

            if (result.success) {
              setUsers((prev) => [result.data, ...prev]);
            } else {
              console.error("❌ Create failed:", result.message);
            }
          }

          setShowUserModal(false);
        }}
        initialData={editUser || {}}
        mode={editUser ? "edit" : "create"}
        role={newRole} // ✅ this tells modal which form to show
      />

      {/* Page Content */}
      <div className="p-6">
        {/* Page Title */}
        <h1 className="text-2xl font-bold mt-0 mb-3">Users</h1>

        {/* Filter bar */}
        <div className="flex items-center justify-between rounded-lg py-3 mb-2">
          <div className="flex items-center gap-4 bg-white rounded-lg shadow px-4 py-3">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Filter By
              </span>
            </div>

            {/* Location Filter - Entire Area Clickable */}
            <div
              onClick={() => document.getElementById("locationFilter").focus()} // Focus the select element
              className="px-2 cursor-pointer"
            >
              <select
                id="locationFilter"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="bg-transparent text-sm text-gray-700 focus:outline-none"
              >
                <option value="">Location</option>
                <option value="Mandaue City">Mandaue City</option>
                <option value="Lapu-Lapu City">Lapu-lapu City</option>
              </select>
            </div>

            {/* Role Filter */}
            <div className="px-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-transparent text-sm text-gray-700 focus:outline-none"
              >
                <option value="">Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            {/* Start Date Filter with Text */}
            <div className="px-2">
              <label
                htmlFor="startDate"
                className="font-semibold text-sm  text-gray-700 mr-2"
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

            {/* End Date Filter with Text */}
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

            {/* Reset Filter */}
            <div className="px-2">
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Filter
              </button>
            </div>
          </div>

          {/* Right side: Plus button */}
          <div className="ml-auto">
            <button
              onClick={() => setShowAddMenu((prev) => !prev)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-[#43A866] text-white hover:bg-green-700"
            >
              <Plus className="w-5 h-5" />
            </button>

            {showAddMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                <button
                  onClick={() => handleAdd("User")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Add a User
                </button>
                <button
                  onClick={() => handleAdd("Admin")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Add an Admin
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-200 text-left text-gray-700">
                <th className="p-3">ID</th>
                <th className="p-3">First Name</th>
                <th className="p-3">Last Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Location</th>
                <th className="p-3">Role</th>
                <th className="p-3">Date Created</th>
                <th className="p-3">Date Modified</th>
                <th className="p-3">Verified</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers?.map((u) => (
                <tr
                  key={u.uid}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3">{u.uid}</td>
                  <td className="p-3">{u.first_name}</td>
                  <td className="p-3">{u.last_name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.location}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">{u.created_at?.split("T")[0]}</td>
                  <td className="p-3">{u.date_modified}</td>
                  <td className="p-3">{u.verified || "false"}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => {
                        setEditUser(u);
                        setShowUserModal(true);
                      }}
                      className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeleteTarget(u); // store user being deleted
                        setShowConfirmModal(true); // open modal
                      }}
                      className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ConfirmModal
            isOpen={showConfirmModal}
            onClose={() => {
              setDeleteTarget(null);
              setShowConfirmModal(false);
            }}
            onConfirm={() => {
              setUsers((prev) =>
                prev.filter((x) => x.uid !== deleteTarget.uid)
              );
              setDeleteTarget(null);
              setShowConfirmModal(false);
            }}
            message={`Are you sure you want to delete ${deleteTarget?.first_name} ${deleteTarget?.last_name}?`}
          />
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-between items-center p-4">
          {/* Rows per page */}
          <div>
            <label className="mr-2 text-sm">Rows per page:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // reset to first page
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          {/* Pagination buttons */}
          <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
            <p>
              Showing {startIndex + 1}-
              {Math.min(endIndex, currentUsers.length)} of {currentUsers.length}
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                &lt;
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                &gt;
              </button>
            </div>

            {/* Rows per page selector */}
            <div className="ml-4">
              <label className="mr-2">Rows per page:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded px-2 py-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Users;
