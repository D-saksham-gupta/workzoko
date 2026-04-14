import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data);
      } catch {
        toast.error("Job not found");
        navigate("/jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  useEffect(() => {
    const checkApplied = async () => {
      if (!user || user.role !== "jobseeker") return;
      try {
        const { data } = await api.get("/applications/my");
        const applied = data.some((app) => app.job?._id === id);
        setAlreadyApplied(applied);
      } catch {}
    };
    checkApplied();
  }, [id, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      const formData = new FormData();
      formData.append("coverLetter", coverLetter);
      if (resumeFile) formData.append("resume", resumeFile);

      await api.post(`/applications/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Application submitted successfully!");
      setAlreadyApplied(true);
      setShowApplyForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );

  if (!job) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 mt-9">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-7 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {job.title}
              </h1>
              <p className="text-blue-600 font-medium text-lg">
                {job.postedBy?.companyName}
              </p>
              {job.postedBy?.companyWebsite && (
                <a
                  href={job.postedBy.companyWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-gray-400 hover:text-blue-500 underline"
                >
                  {job.postedBy.companyWebsite}
                </a>
              )}
            </div>
            <div className="shrink-0">
              {!user ? (
                <button
                  onClick={() => navigate("/login")}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 font-semibold"
                >
                  Login to Apply
                </button>
              ) : user.role === "jobseeker" ? (
                alreadyApplied ? (
                  <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-5 py-2.5 rounded-xl font-semibold border border-green-200">
                    ✅ Applied
                  </span>
                ) : (
                  <button
                    onClick={() => setShowApplyForm(!showApplyForm)}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 font-semibold"
                  >
                    {showApplyForm ? "Cancel" : "Apply Now"}
                  </button>
                )
              ) : null}
            </div>
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-gray-100">
            {[
              { icon: "📍", label: job.location },
              {
                icon: "💼",
                label: `${job.experienceMin}–${job.experienceMax} years`,
              },
              {
                icon: "💰",
                label:
                  job.salaryMin > 0
                    ? `${job.salaryMin}–${job.salaryMax} LPA`
                    : "Not disclosed",
              },
              { icon: "🕐", label: job.jobType },
              {
                icon: "👥",
                label: `${job.numberOfPositions} opening${job.numberOfPositions > 1 ? "s" : ""}`,
              },
              ...(job.lastDateToApply
                ? [
                    {
                      icon: "📅",
                      label: `Apply by ${new Date(job.lastDateToApply).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`,
                    },
                  ]
                : []),
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Apply Form */}
        {showApplyForm && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Submit Your Application
            </h2>
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell the employer why you're a great fit..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
              </div>
              {user.resume > 0 ? (
                <div>
                  <h3>Your profile already have your updated resume</h3>
                  <p>
                    If you want to use another resume please update it on your
                    profile
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resume{" "}
                    <span className="text-gray-400 font-normal">
                      (PDF/DOC — leave blank to use profile resume)
                    </span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-medium hover:file:bg-blue-700"
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={applying}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 font-semibold disabled:opacity-60"
              >
                {applying ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left — Main Content */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 text-lg mb-3">
                Job Description
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>

            {job.keySkills?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 text-lg mb-3">
                  Key Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.keySkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-50 text-blue-700 text-sm px-3 py-1.5 rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — Company Info */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 text-lg mb-3">
                About the Company
              </h2>
              <p className="font-medium text-gray-800 mb-1">
                {job.postedBy?.companyName}
              </p>
              {job.postedBy?.companyDescription ? (
                <p className="text-sm text-gray-500 leading-relaxed">
                  {job.postedBy.companyDescription}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  No description provided
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 text-lg mb-3">
                Job Summary
              </h2>
              <div className="space-y-2.5 text-sm">
                {[
                  [
                    "Posted on",
                    new Date(job.createdAt).toLocaleDateString("en-IN"),
                  ],
                  ["Job Type", job.jobType],
                  [
                    "Experience",
                    `${job.experienceMin}–${job.experienceMax} years`,
                  ],
                  ["Openings", job.numberOfPositions],
                  [
                    "Salary",
                    job.salaryMin > 0
                      ? `${job.salaryMin}–${job.salaryMax} LPA`
                      : "Not disclosed",
                  ],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-400">{label}</span>
                    <span className="text-gray-700 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
