import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
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

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    totalApps: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/jobs/my/posted");
        setJobs(data);

        const approved = data.filter((j) => j.status === "approved").length;
        const pending = data.filter((j) => j.status === "pending").length;
        const rejected = data.filter((j) => j.status === "rejected").length;

        const appsRes = await api.get("/applications/recruiter/all");
        setStats({
          total: data.length,
          approved,
          pending,
          rejected,
          totalApps: appsRes.data.totalApplications,
        });
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusStyle = {
    approved: "bg-green-50 text-green-700",
    pending: "bg-yellow-50 text-yellow-700",
    rejected: "bg-red-50 text-red-700",
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
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Recruiter Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Manage your job postings and applicants
            </p>
          </div>
          <Link
            to="/recruiter/post-job"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 font-semibold text-sm"
          >
            + Post a Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            label="Total Jobs"
            value={stats.total}
            icon="📋"
            color="bg-blue-50"
          />
          <StatCard
            label="Approved"
            value={stats.approved}
            icon="✅"
            color="bg-green-50"
          />
          <StatCard
            label="Pending"
            value={stats.pending}
            icon="⏳"
            color="bg-yellow-50"
          />
          <StatCard
            label="Rejected"
            value={stats.rejected}
            icon="❌"
            color="bg-red-50"
          />
          <StatCard
            label="Total Applicants"
            value={stats.totalApps}
            icon="👥"
            color="bg-purple-50"
          />
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Your Posted Jobs</h2>
            <Link
              to="/recruiter/jobs"
              className="text-sm text-blue-600 hover:underline"
            >
              View all →
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-500 mb-4">
                You haven't posted any jobs yet
              </p>
              <Link
                to="/recruiter/post-job"
                className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 font-semibold text-sm"
              >
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {jobs.slice(0, 5).map((job) => (
                <div
                  key={job._id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{job.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      📍 {job.location} · {job.jobType} ·{" "}
                      {job.numberOfPositions} opening
                      {job.numberOfPositions > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize ${statusStyle[job.status]}`}
                    >
                      {job.status}
                    </span>
                    <Link
                      to={`/recruiter/jobs/${job._id}/applicants`}
                      className="text-sm text-blue-600 hover:underline font-medium"
                    >
                      View Applicants
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

export default RecruiterDashboard;
