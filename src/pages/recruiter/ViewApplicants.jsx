import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";

const statusOptions = ["applied", "viewed", "shortlisted", "rejected", "hired"];

const statusStyle = {
  applied: "bg-blue-50 text-blue-700",
  viewed: "bg-yellow-50 text-yellow-700",
  shortlisted: "bg-purple-50 text-purple-700",
  rejected: "bg-red-50 text-red-700",
  hired: "bg-green-50 text-green-700",
};

const ViewApplicants = () => {
  const { jobId } = useParams();
  const [data, setData] = useState({ applications: [], totalApplicants: 0 });
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, jobRes] = await Promise.all([
          api.get(`/applications/job/${jobId}`),
          api.get(`/jobs/${jobId}`),
        ]);
        setData(appsRes.data);
        setJob(jobRes.data);
      } catch {
        toast.error("Failed to load applicants");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId]);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await api.put(`/applications/${appId}/status`, { status: newStatus });
      setData((prev) => ({
        ...prev,
        applications: prev.applications.map((a) =>
          a._id === appId ? { ...a, status: newStatus } : a,
        ),
      }));
      toast.success(`Status updated to "${newStatus}"`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filterStatus
    ? data.applications.filter((a) => a.status === filterStatus)
    : data.applications;

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 mt-9">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/recruiter/jobs"
            className="text-sm text-blue-600 hover:underline mb-2 inline-block"
          >
            ← Back to My Jobs
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{job?.title}</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {data.totalApplicants} applicant
            {data.totalApplicants !== 1 ? "s" : ""} · 📍 {job?.location} ·{" "}
            {job?.jobType}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setFilterStatus("")}
            className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterStatus === ""
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300"
            }`}
          >
            All ({data.applications.length})
          </button>
          {statusOptions.map((s) => {
            const count = data.applications.filter(
              (a) => a.status === s,
            ).length;
            if (count === 0) return null;
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-sm px-3 py-1.5 rounded-lg font-medium capitalize transition-all ${
                  filterStatus === s
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300"
                }`}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>

        {/* Applicants List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-gray-500">
              No applicants{" "}
              {filterStatus ? `with status "${filterStatus}"` : "yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-2xl border border-gray-200 p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Applicant Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {app.applicant?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {app.applicant?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {app.applicant?.email}
                      </p>
                      {app.applicant?.location && (
                        <p className="text-sm text-gray-500">
                          📍 {app.applicant.location}
                        </p>
                      )}
                      {app.applicant?.experience && (
                        <p className="text-sm text-gray-500">
                          💼 {app.applicant.experience}
                        </p>
                      )}
                      {app.applicant?.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {app.applicant.skills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                      {app.coverLetter && (
                        <details className="mt-2">
                          <summary className="text-xs text-blue-600 cursor-pointer hover:underline">
                            View cover letter
                          </summary>
                          <p className="text-sm text-gray-600 mt-1.5 bg-gray-50 p-3 rounded-lg leading-relaxed">
                            {app.coverLetter}
                          </p>
                        </details>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                    <span
                      className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize ${statusStyle[app.status]}`}
                    >
                      {app.status}
                    </span>

                    <select
                      value={app.status}
                      disabled={updatingId === app._id}
                      onChange={(e) =>
                        handleStatusChange(app._id, e.target.value)
                      }
                      className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s} className="capitalize">
                          {s}
                        </option>
                      ))}
                    </select>

                    {app.resume && (
                      <a
                        href={`http://localhost:5000/${app.resume}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline font-medium"
                      >
                        📄 View Resume
                      </a>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                  Applied on{" "}
                  {new Date(app.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewApplicants;
