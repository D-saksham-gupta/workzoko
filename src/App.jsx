import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Jobseeker
import BrowseJobs from "./pages/jobseeker/BrowseJobs";
import JobDetail from "./pages/jobseeker/JobDetail";
import MyApplications from "./pages/jobseeker/MyApplications";
import Profile from "./pages/jobseeker/Profile";

// Recruiter
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import PostJob from "./pages/recruiter/PostJob";
import MyPostedJobs from "./pages/recruiter/MyPostedJobs";
import ViewApplicants from "./pages/recruiter/ViewApplicants";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminUsers from "./pages/admin/AdminUsers";
import Landing from "./pages/Landing";

const Unauthorized = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
    <p className="text-5xl">🚫</p>
    <h1 className="text-xl font-bold text-gray-900">Access Denied</h1>
    <p className="text-gray-500 text-sm">
      You don't have permission to view this page.
    </p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<BrowseJobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Jobseeker */}
          <Route
            path="/my-applications"
            element={
              <ProtectedRoute roles={["jobseeker"]}>
                <MyApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={["jobseeker", "recruiter"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Recruiter */}
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute roles={["recruiter"]}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/post-job"
            element={
              <ProtectedRoute roles={["recruiter"]}>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs"
            element={
              <ProtectedRoute roles={["recruiter"]}>
                <MyPostedJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/:jobId/applicants"
            element={
              <ProtectedRoute roles={["recruiter"]}>
                <ViewApplicants />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
