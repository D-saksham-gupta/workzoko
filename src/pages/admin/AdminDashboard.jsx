import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

const StatCard = ({ label, value, icon, color, to }) => {
  const content = (
    <div
      className={`bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-sm transition-shadow ${to ? "cursor-pointer hover:border-blue-200" : ""}`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, jobsRes] = await Promise.all([
          api.get("/admin/dashboard"),
          api.get("/jobs/admin/all?status=pending&limit=5"),
        ]);
        setStats(statsRes.data);
        setPendingJobs(jobsRes.data.jobs);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleJobAction = async (jobId, status) => {
    try {
      await api.put(`/jobs/${jobId}/status`, { status });
      setPendingJobs((prev) => prev.filter((j) => j._id !== jobId));
      setStats((prev) => ({
        ...prev,
        pendingJobs: prev.pendingJobs - 1,
        approvedJobs:
          status === "approved" ? prev.approvedJobs + 1 : prev.approvedJobs,
        rejectedJobs:
          status === "rejected" ? prev.rejectedJobs + 1 : prev.rejectedJobs,
      }));
    } catch {
      // silent
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 mt-9">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Overview of the entire Workzoko platform
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Jobseekers"
              value={stats.totalJobseekers}
              icon="👤"
              color="bg-blue-50"
              to="/admin/users?role=jobseeker"
            />
            <StatCard
              label="Recruiters"
              value={stats.totalRecruiters}
              icon="🏢"
              color="bg-purple-50"
              to="/admin/users?role=recruiter"
            />
            <StatCard
              label="Total Jobs"
              value={stats.totalJobs}
              icon="📋"
              color="bg-green-50"
              to="/admin/jobs"
            />
            <StatCard
              label="Applications"
              value={stats.totalApplications}
              icon="📨"
              color="bg-yellow-50"
            />
            <StatCard
              label="Pending Jobs"
              value={stats.pendingJobs}
              icon="⏳"
              color="bg-orange-50"
              to="/admin/jobs?status=pending"
            />
            <StatCard
              label="Approved Jobs"
              value={stats.approvedJobs}
              icon="✅"
              color="bg-green-50"
              to="/admin/jobs?status=approved"
            />
            <StatCard
              label="Rejected Jobs"
              value={stats.rejectedJobs}
              icon="❌"
              color="bg-red-50"
              to="/admin/jobs?status=rejected"
            />
            <StatCard
              label="Blocked Users"
              value={stats.blockedUsers}
              icon="🚫"
              color="bg-gray-100"
              to="/admin/users"
            />
          </div>
        )}

        {/* Pending Jobs Quick Review */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="font-semibold text-gray-900">
                Pending Job Approvals
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Approve or reject directly from here
              </p>
            </div>
            <Link
              to="/admin/jobs?status=pending"
              className="text-sm text-blue-600 hover:underline"
            >
              View all →
            </Link>
          </div>

          {pendingJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-3xl mb-2">🎉</p>
              <p className="text-gray-500 text-sm">
                All jobs reviewed — nothing pending!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {pendingJobs.map((job) => (
                <div
                  key={job._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{job.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      🏢 {job.postedBy?.companyName} · 📍 {job.location} ·{" "}
                      {job.jobType}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Posted by {job.postedBy?.email} on{" "}
                      {new Date(job.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleJobAction(job._id, "approved")}
                      className="bg-green-50 text-green-700 hover:bg-green-100 px-4 py-1.5 rounded-lg text-sm font-medium"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleJobAction(job._id, "rejected")}
                      className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-1.5 rounded-lg text-sm font-medium"
                    >
                      ❌ Reject
                    </button>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="bg-gray-50 text-gray-600 hover:bg-gray-100 px-4 py-1.5 rounded-lg text-sm font-medium"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
