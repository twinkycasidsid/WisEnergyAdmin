import React, { useEffect, useState } from "react";
import { Filter, RotateCcw, Plus, Edit2, Trash2 } from "lucide-react";
import UserModal from "./UserModal";
import {
  addNewUser,
  fetchAllUsers,
  updateUser,
} from "../../../services/apiService";
import { useSearch } from "../SearchContext";
import ConfirmModal from "./ConfirmModal";

function Users() {
  const { searchQuery } = useSearch();

  useEffect(() => {
    document.title = "Users | WisEnergy";
  }, []);

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
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentUsers = (filteredUsers || []).slice(startIndex, endIndex);
  const totalPages = Math.ceil((filteredUsers || []).length / itemsPerPage);

  // Filter states
  const [locationFilter, setLocationFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      const result = await fetchAllUsers();
      setUsers(result);
      setFilteredUsers(result);
    };
    fetchUsers();
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = users;

    if (locationFilter)
      filtered = filtered.filter((u) => u.location === locationFilter);
    if (roleFilter) filtered = filtered.filter((u) => u.role === roleFilter);
    if (startDateFilter && endDateFilter) {
      const start = new Date(startDateFilter);
      const end = new Date(endDateFilter);
      filtered = filtered.filter((u) => {
        const date = new Date(u.created_at?.split("T")[0]);
        return date >= start && date <= end;
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.uid?.toLowerCase().includes(q) ||
          u.first_name?.toLowerCase().includes(q) ||
          u.last_name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.location?.toLowerCase().includes(q) ||
          u.role?.toLowerCase().includes(q)
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
    setEditUser(null);
    setNewRole(role);
    setShowUserModal(true);
    setShowAddMenu(false);
  };

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
        existingEmails={
          users?.map((u) => u.email?.toLowerCase()).filter(Boolean) || []
        }
        onSubmit={async (formData) => {
          try {
            // Prepare payload for API
            const payload = {
              first_name: formData.first_name,
              last_name: formData.last_name,
              email: formData.email,
              role: formData.role.toLowerCase() === "admin" ? "Admin" : "User",
              ...(formData.role.toLowerCase() !== "admin"
                ? { location: formData.location }
                : {}),
              ...(formData.role.toLowerCase() === "admin" && formData.password
                ? { password: formData.password }
                : {}),
            };

            let result;
            if (editUser) {
              // ✅ Update user API call
              result = await updateUser(editUser.uid, payload);

              if (result?.success) {
                // ✅ Update the local state
                setUsers((prev) =>
                  prev.map((u) =>
                    u.uid === editUser.uid ? { ...u, ...payload } : u
                  )
                );
                alert("✅ User details updated successfully");
              }
            } else {
              // ✅ Add new user
              result = await addNewUser(payload);
              if (result?.success) {
                setUsers((prev) => [result.data, ...prev]);
              }
            }

            setShowUserModal(false);

            if (!result?.success) {
              const msg = result?.message || JSON.stringify(result);
              alert(`❌ Operation failed: ${msg}`);
            }
          } catch (err) {
            console.error(err);
            alert(`❌ Operation failed: ${err.message || JSON.stringify(err)}`);
          }
        }}
        initialData={editUser || {}}
        mode={editUser ? "edit" : "create"}
        role={newRole}
      />

      {/* Page Content */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mt-0 mb-3">Users</h1>

        {/* Filter Bar */}
        <div className="flex items-center justify-between rounded-lg py-3 mb-2">
          <div className="flex items-center bg-white rounded-lg shadow px-4 py-3 divide-x divide-gray-200">
            <div className="flex items-center gap-2 px-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Filter By
              </span>
            </div>

            <div className="px-4">
              <label htmlFor="locationFilter" className="sr-only">
                Location
              </label>
              <select
                id="locationFilter"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="bg-transparent text-sm text-gray-700 focus:outline-none"
              >
                <option value="">Location</option>
                <option value="Mandaue City">Mandaue City</option>
                <option value="Lapu-Lapu City">Lapu-Lapu City</option>
              </select>
            </div>

            <div className="px-4">
              <label htmlFor="roleFilter" className="sr-only">
                Role
              </label>
              <select
                id="roleFilter"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-transparent text-sm text-gray-700 focus:outline-none"
              >
                <option value="">Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className="px-4">
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

            <div className="px-4">
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
                <RotateCcw className="w-4 h-4" /> Reset Filter
              </button>
            </div>
          </div>

          <div className="ml-auto relative">
            <button
              aria-label="Add User Menu"
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

        {/* User Table */}
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
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((u) => (
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
                  <td className="p-3">{u.updated_at}</td>
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
                        setDeleteTarget(u);
                        setShowConfirmModal(true);
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
          {/* ✅ No Results Found */}
          {filteredUsers.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No results found
            </div>
          )}
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
              alert("✅ User deleted successfully");

            }}
            message={`Are you sure you want to delete ${deleteTarget?.first_name} ${deleteTarget?.last_name}?`}
          />
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
            <p>
              Showing {startIndex + 1}-
              {Math.min(endIndex, filteredUsers.length)} of{" "}
              {filteredUsers.length}
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
    </>
  );
}

export default Users;
