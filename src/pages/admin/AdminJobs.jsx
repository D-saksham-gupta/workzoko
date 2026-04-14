import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";

const statusStyle = {
  approved: "bg-green-50 text-green-700",
  pending: "bg-yellow-50 text-yellow-700",
  rejected: "bg-red-50 text-red-700",
};

const AdminJobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
  });
  const [updatingId, setUpdatingId] = useState(null);

  const statusFilter = searchParams.get("status") || "";
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 10 };
        if (statusFilter) params.status = statusFilter;
        const { data } = await api.get("/jobs/admin/all", { params });
        setJobs(data.jobs);
        setPagination({
          currentPage: page,
          totalPages: data.totalPages,
          totalJobs: data.totalJobs,
        });
      } catch {
        toast.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [statusFilter, page]);

  const handleStatus = async (jobId, status) => {
    setUpdatingId(jobId);
    try {
      await api.put(`/jobs/${jobId}/status`, { status });
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, status } : j)),
      );
      toast.success(`Job ${status}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const setFilter = (val) => {
    const params = {};
    if (val) params.status = val;
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 mt-9">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Jobs</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {pagination.totalJobs} jobs total
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {["", "pending", "approved", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-sm px-4 py-2 rounded-xl font-medium capitalize transition-all ${
                statusFilter === s
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300"
              }`}
            >
              {s === "" ? "All Jobs" : s}
            </button>
          ))}
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500">No {statusFilter || ""} jobs found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusStyle[job.status]}`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-1.5 text-sm text-gray-500">
                      <span>🏢 {job.postedBy?.companyName || "N/A"}</span>
                      <span>📍 {job.location}</span>
                      <span>🕐 {job.jobType}</span>
                      <span>
                        💼 {job.experienceMin}–{job.experienceMax} yrs
                      </span>
                      {job.salaryMin > 0 && (
                        <span>
                          💰 {job.salaryMin}–{job.salaryMax} LPA
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      By {job.postedBy?.email} · Posted{" "}
                      {new Date(job.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    {job.status !== "approved" && (
                      <button
                        onClick={() => handleStatus(job._id, "approved")}
                        disabled={updatingId === job._id}
                        className="bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50"
                      >
                        ✅ Approve
                      </button>
                    )}
                    {job.status !== "rejected" && (
                      <button
                        onClick={() => handleStatus(job._id, "rejected")}
                        disabled={updatingId === job._id}
                        className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50"
                      >
                        ❌ Reject
                      </button>
                    )}
                    <Link
                      to={`/jobs/${job._id}`}
                      className="bg-gray-50 text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium"
                    >
                      View
                    </Link>
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
                  setSearchParams({
                    ...(statusFilter && { status: statusFilter }),
                    page: i + 1,
                  })
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

export default AdminJobs;
