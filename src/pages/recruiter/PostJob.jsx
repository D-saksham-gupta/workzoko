import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    keySkills: [],
    location: "",
    jobType: "Full-time",
    experienceMin: 0,
    experienceMax: 3,
    salaryMin: 0,
    salaryMax: 0,
    numberOfPositions: 1,
    lastDateToApply: "",
  });

  const set = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !formData.keySkills.includes(s)) {
      set("keySkills", [...formData.keySkills, s]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    set(
      "keySkills",
      formData.keySkills.filter((s) => s !== skill),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.keySkills.length === 0) {
      return toast.error("Please add at least one skill");
    }
    setLoading(true);
    try {
      await api.post("/jobs", formData);
      toast.success("Job posted! Awaiting admin approval.");
      navigate("/recruiter/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 mt-9">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
          <p className="text-gray-500 text-sm mt-1">
            Fill in the details below. Your job will be reviewed by admin before
            going live.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Senior Frontend Developer"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description *
              </label>
              <textarea
                rows={6}
                required
                value={formData.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe the role, responsibilities, requirements, perks..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="e.g. Bengaluru / Remote"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type
                </label>
                <select
                  value={formData.jobType}
                  onChange={(e) => set("jobType", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
                >
                  {jobTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
            <h2 className="font-semibold text-gray-900">Key Skills *</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Type a skill and press Enter or Add"
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="button"
                onClick={addSkill}
                className="bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 font-medium text-sm"
              >
                Add
              </button>
            </div>
            {formData.keySkills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {formData.keySkills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-sm px-3 py-1.5 rounded-full font-medium"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-red-500 font-bold leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Experience & Salary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">
              Experience & Compensation
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Experience (yrs)
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.experienceMin}
                  onChange={(e) => set("experienceMin", Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Experience (yrs)
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.experienceMax}
                  onChange={(e) => set("experienceMax", Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Salary (LPA)
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.salaryMin}
                  onChange={(e) => set("salaryMin", Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Salary (LPA)
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.salaryMax}
                  onChange={(e) => set("salaryMax", Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Other Details */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Other Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Openings
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.numberOfPositions}
                  onChange={(e) =>
                    set("numberOfPositions", Number(e.target.value))
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Date to Apply
                </label>
                <input
                  type="date"
                  value={formData.lastDateToApply}
                  onChange={(e) => set("lastDateToApply", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold disabled:opacity-60 text-sm"
          >
            {loading ? "Posting..." : "Post Job →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
