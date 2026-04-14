import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";

const AdminUsers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  const roleFilter = searchParams.get("role") || "jobseeker";
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, page]);

  const fetchUsers = async (searchVal = search) => {
    setLoading(true);
    try {
      const endpoint =
        roleFilter === "recruiter" ? "/admin/recruiters" : "/admin/jobseekers";
      const params = { page, limit: 10 };
      if (searchVal) params.search = searchVal;
      const { data } = await api.get(endpoint, { params });

      const list = data.jobseekers || data.recruiters || [];
      const total = data.totalJobseekers || data.totalRecruiters || 0;
      setUsers(list);
      setPagination({ currentPage: page, totalPages: data.totalPages, total });
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(search);
  };

  const handleBlock = async (userId, isBlocked) => {
    setActionId(userId);
    try {
      const endpoint = isBlocked
        ? `/admin/users/${userId}/unblock`
        : `/admin/users/${userId}/block`;
      await api.put(endpoint);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isBlocked: !isBlocked } : u,
        ),
      );
      toast.success(isBlocked ? "User unblocked" : "User blocked");
    } catch {
      toast.error("Action failed");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (userId, name) => {
    if (
      !window.confirm(
        `Permanently delete "${name}" and all their data? This cannot be undone.`,
      )
    )
      return;
    setActionId(userId);
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setActionId(null);
    }
  };

  const setRole = (role) => setSearchParams({ role });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 mt-9">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {pagination.total} {roleFilter}s total
          </p>
        </div>

        {/* Role Toggle + Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex rounded-xl border border-gray-200 bg-white p-1 w-fit">
            {["jobseeker", "recruiter"].map((role) => (
              <button
                key={role}
                onClick={() => setRole(role)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  roleFilter === role
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {role === "jobseeker" ? "👤 Jobseekers" : "🏢 Recruiters"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search by name, email${roleFilter === "recruiter" ? ", company" : ""}...`}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 text-sm font-medium"
            >
              Search
            </button>
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  fetchUsers("");
                }}
                className="bg-gray-100 text-gray-600 px-4 py-2.5 rounded-xl hover:bg-gray-200 text-sm font-medium"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Users List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500">No {roleFilter}s found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user._id}
                className={`bg-white rounded-2xl border p-5 transition-shadow hover:shadow-sm ${
                  user.isBlocked
                    ? "border-red-200 bg-red-50/30"
                    : "border-gray-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 ${
                        user.isBlocked ? "bg-red-400" : "bg-blue-600"
                      }`}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">
                          {user.name}
                        </p>
                        {user.isBlocked && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                            Blocked
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      {roleFilter === "recruiter" && user.companyName && (
                        <p className="text-sm text-gray-500">
                          🏢 {user.companyName}
                        </p>
                      )}
                      {roleFilter === "jobseeker" && user.location && (
                        <p className="text-sm text-gray-500">
                          📍 {user.location}
                        </p>
                      )}
                      {roleFilter === "jobseeker" &&
                        user.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {user.skills.slice(0, 3).map((s) => (
                              <span
                                key={s}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      <p className="text-xs text-gray-400 mt-1">
                        Joined{" "}
                        {new Date(user.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button
                      onClick={() => handleBlock(user._id, user.isBlocked)}
                      disabled={actionId === user._id}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors ${
                        user.isBlocked
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                      }`}
                    >
                      {actionId === user._id
                        ? "..."
                        : user.isBlocked
                          ? "🔓 Unblock"
                          : "🚫 Block"}
                    </button>
                    <button
                      onClick={() => handleDelete(user._id, user.name)}
                      disabled={actionId === user._id}
                      className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() =>
                  setSearchParams({ role: roleFilter, page: i + 1 })
                }
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                  pagination.currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
