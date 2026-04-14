import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";

const statusStyle = {
  approved: "bg-green-50 text-green-700",
  pending: "bg-yellow-50 text-yellow-700",
  rejected: "bg-red-50 text-red-700",
};

const MyPostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/jobs/my/posted")
      .then(({ data }) => setJobs(data))
      .catch(() => toast.error("Failed to load jobs"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job? This cannot be undone.")) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter((j) => j._id !== jobId));
      toast.success("Job deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
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
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Posted Jobs</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {jobs.length} job{jobs.length !== 1 ? "s" : ""} posted
            </p>
          </div>
          <Link
            to="/recruiter/post-job"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 font-semibold text-sm"
          >
            + Post New Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500 mb-4">No jobs posted yet</p>
            <Link
              to="/recruiter/post-job"
              className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 font-semibold text-sm"
            >
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-base">
                        {job.title}
                      </h3>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusStyle[job.status]}`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-1.5 text-sm text-gray-500">
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
                      <span>
                        👥 {job.numberOfPositions} opening
                        {job.numberOfPositions > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {job.keySkills?.slice(0, 4).map((s) => (
                        <span
                          key={s}
                          className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/recruiter/jobs/${job._id}/applicants`}
                      className="text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium"
                    >
                      Applicants
                    </Link>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="text-sm bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                  Posted on{" "}
                  {new Date(job.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {job.status === "pending" && (
                    <span className="ml-3 text-yellow-600">
                      ⏳ Waiting for admin approval
                    </span>
                  )}
                  {job.status === "rejected" && (
                    <span className="ml-3 text-red-500">
                      ❌ Rejected by admin
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPostedJobs;
