import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";

const statusConfig = {
  applied: { label: "Applied", color: "bg-blue-50 text-blue-700" },
  viewed: { label: "Viewed", color: "bg-yellow-50 text-yellow-700" },
  shortlisted: { label: "Shortlisted", color: "bg-purple-50 text-purple-700" },
  rejected: { label: "Rejected", color: "bg-red-50 text-red-700" },
  hired: { label: "Hired 🎉", color: "bg-green-50 text-green-700" },
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/applications/my");
        setApplications(data);
      } catch {
        toast.error("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleWithdraw = async (appId) => {
    if (!window.confirm("Withdraw this application?")) return;
    try {
      await api.delete(`/applications/${appId}`);
      setApplications(applications.filter((a) => a._id !== appId));
      toast.success("Application withdrawn");
    } catch (err) {
      toast.error(err.response?.data?.message || "Cannot withdraw");
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-500 text-sm mt-1">
            {applications.length} application
            {applications.length !== 1 ? "s" : ""} total
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-gray-500 text-lg mb-4">
              You haven't applied to any jobs yet
            </p>
            <Link
              to="/jobs"
              className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 font-semibold text-sm"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const s = statusConfig[app.status] || statusConfig.applied;
              return (
                <div
                  key={app._id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <Link
                        to={`/jobs/${app.job?._id}`}
                        className="font-semibold text-gray-900 hover:text-blue-600 text-base"
                      >
                        {app.job?.title || "Job no longer available"}
                      </Link>
                      <div className="flex flex-wrap gap-3 mt-1.5 text-sm text-gray-500">
                        <span>{app.job?.postedBy?.companyName}</span>
                        {app.job?.location && (
                          <span>📍 {app.job.location}</span>
                        )}
                        {app.job?.jobType && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                            {app.job.jobType}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-xs px-3 py-1.5 rounded-full font-medium ${s.color}`}
                      >
                        {s.label}
                      </span>
                      {app.status === "applied" && (
                        <button
                          onClick={() => handleWithdraw(app._id)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                    <span>
                      Applied on{" "}
                      {new Date(app.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    {app.coverLetter && (
                      <span className="text-gray-400 italic">
                        Cover letter included
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
