import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    jobType: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
  });

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 9, ...filters };
      const { data } = await api.get("/jobs", { params });
      setJobs(data.jobs);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalJobs: data.totalJobs,
      });
    } catch {
      // handle silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(1);
  };

  const clearFilters = () => {
    setFilters({ keyword: "", location: "", jobType: "" });
    setTimeout(() => fetchJobs(1), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-9">
      {/* Hero Search Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Next Opportunity
          </h1>
          <p className="text-gray-500 mb-6">
            Thousands of jobs from top companies, updated daily
          </p>
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              placeholder="Job title, skill or keyword"
              value={filters.keyword}
              onChange={(e) =>
                setFilters({ ...filters, keyword: e.target.value })
              }
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <select
              value={filters.jobType}
              onChange={(e) =>
                setFilters({ ...filters, jobType: e.target.value })
              }
              className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-600"
            >
              <option value="">All Types</option>
              {jobTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 font-semibold text-sm"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">
            {loading ? "Loading..." : `${pagination.totalJobs} jobs found`}
          </p>
          {(filters.keyword || filters.location || filters.jobType) && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500 text-lg">
              No jobs found. Try different filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <Link
                key={job._id}
                to={`/jobs/${job._id}`}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {job.postedBy?.companyName || "Company"}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ml-2 ${
                      job.jobType === "Remote"
                        ? "bg-green-50 text-green-700"
                        : job.jobType === "Internship"
                          ? "bg-purple-50 text-purple-700"
                          : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {job.jobType}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    📍 {job.location}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    💼 {job.experienceMin}–{job.experienceMax} yrs
                  </span>
                  {job.salaryMin > 0 && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      💰 {job.salaryMin}–{job.salaryMax} LPA
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {job.keySkills?.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.keySkills?.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{job.keySkills.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    {new Date(job.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span className="text-xs text-blue-600 font-medium group-hover:underline">
                    View Details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => fetchJobs(i + 1)}
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

export default BrowseJobs;
