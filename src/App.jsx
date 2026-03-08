import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import RoleGuard from "./auth/RoleGuard";
import StudentOnlyGate from "./auth/StudentOnlyGate";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import OnboardingContainer from "./components/onboarding/OnboardingContainer";
import {
  clearOnboardingDraft,
  isOnboardingComplete,
  loadOnboardingDraft,
  loadOnboardingState,
  resetOnboarding
} from "./onboarding/onboardingStorage";
import { clearPersonalizationProfile } from "./personalization/personalizationStorage";
import Home from "./pages/Home";
import CareerPath from "./pages/CareerPath";
import CareerQuiz from "./pages/CareerQuiz";
import CollegeMatch from "./pages/CollegeMatch";
import CollegeQuiz from "./pages/CollegeQuiz";
import MoneySkills from "./pages/MoneySkills";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import StudyAssistant from "./pages/StudyAssistant";
import ClassesPage from "./pages/ClassesPage";
import ClassDetailPage from "./pages/ClassDetailPage";
import AssignmentDetailPage from "./pages/AssignmentDetailPage";
import TeacherPage from "./pages/TeacherPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import RoleAwareDashboard from "./pages/RoleAwareDashboard";
import { useAuth } from "./auth/useAuth";
import AuthCallbackPage from "./pages/AuthCallbackPage";

export default function App() {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (!isAuthenticated) return false;
    if (userRole === "teacher") return false;
    const complete = isOnboardingComplete();
    const state = loadOnboardingState();
    const draft = loadOnboardingDraft();
    return !complete && (!state?.primaryPath || Boolean(draft));
  });

  useEffect(() => {
    const titles = {
      "/": "NextStep | Student Future Planning",
      "/career": "NextStep | Career Path Module",
      "/career/quiz": "NextStep | Career Quiz",
      "/college": "NextStep | College Match Module",
      "/college/quiz": "NextStep | College Match Quiz",
      "/money": "NextStep | Money Skills Module",
      "/dashboard": "NextStep | Learning Hub",
      "/login": "NextStep | Log In",
      "/signup": "NextStep | Sign Up",
      "/auth/role": "NextStep | Choose Role",
      "/auth/callback": "NextStep | Completing Sign In",
      "/forgot-password": "NextStep | Reset Password",
      "/profile": "NextStep | Profile",
      "/study-assistant": "NextStep | Study Assistant",
      "/classes": "NextStep | My Classes",
      "/teacher": "NextStep | Teacher Dashboard",
      "/teacher/dashboard": "NextStep | Teacher Dashboard",
      "/teacher/classes": "NextStep | Teacher Classes",
      "/teacher/students": "NextStep | Students",
      "/teacher/upload": "NextStep | Upload Materials"
    };
    document.title = titles[location.pathname] ?? "NextStep | Student Future Planning";
  }, [location.pathname]);

  useEffect(() => {
    if (!isAuthenticated || userRole === "teacher") {
      setShowOnboarding(false);
      return;
    }
    const complete = isOnboardingComplete();
    const state = loadOnboardingState();
    const draft = loadOnboardingDraft();
    setShowOnboarding(!complete && (!state?.primaryPath || Boolean(draft)));
  }, [isAuthenticated, userRole]);

  useEffect(() => {
    const state = loadOnboardingState();
    const draft = loadOnboardingDraft();
    if (isOnboardingComplete()) return;
    if (!isAuthenticated || userRole === "teacher") return;
    if (!state?.primaryPath) return;
    if (draft) return;
    if (location.pathname !== "/") return;
    const target = state.primaryPath === "career"
      ? "/career/quiz"
      : state.primaryPath === "college"
        ? "/college/quiz"
        : "/money";
    navigate(target);
  }, [isAuthenticated, location.pathname, navigate, userRole]);

  function handleOnboardingComplete(payload) {
    if (payload?.closeOnly) {
      setShowOnboarding(false);
      return;
    }
    setShowOnboarding(false);
    if (payload?.targetRoute) navigate(payload.targetRoute);
  }

  function handleRestartOnboarding() {
    resetOnboarding();
    clearOnboardingDraft();
    clearPersonalizationProfile();
    setShowOnboarding(true);
    navigate("/");
  }

  const isAuthScreen = ["/auth/role", "/auth/callback", "/login", "/signup", "/forgot-password"].includes(location.pathname);

  useEffect(() => {
    if (!location.state?.resumeOnboarding) return;
    setShowOnboarding(true);
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.pathname, location.state, navigate]);

  return (
    <div className="app-shell">
      <Navbar />
      <main className="container page-wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/career" element={<StudentOnlyGate><CareerPath /></StudentOnlyGate>} />
          <Route path="/career/quiz" element={<StudentOnlyGate><CareerQuiz /></StudentOnlyGate>} />
          <Route path="/college" element={<StudentOnlyGate><CollegeMatch /></StudentOnlyGate>} />
          <Route path="/college/quiz" element={<StudentOnlyGate><CollegeQuiz /></StudentOnlyGate>} />
          <Route path="/money" element={<StudentOnlyGate><MoneySkills /></StudentOnlyGate>} />
          <Route path="/auth/role" element={<RoleSelectionPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route
            path="/study-assistant"
            element={(
              <ProtectedRoute allowGuest>
                <StudyAssistant />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/classes"
            element={(
              <ProtectedRoute>
                <ClassesPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/classes/:classId"
            element={(
              <ProtectedRoute>
                <ClassDetailPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/classes/:classId/assignments/:assignmentId"
            element={(
              <ProtectedRoute>
                <AssignmentDetailPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/teacher"
            element={(
              <ProtectedRoute>
                <RoleGuard role="teacher">
                  <TeacherPage />
                </RoleGuard>
              </ProtectedRoute>
            )}
          />
          <Route
            path="/teacher/dashboard"
            element={(
              <ProtectedRoute>
                <RoleGuard role="teacher">
                  <TeacherPage />
                </RoleGuard>
              </ProtectedRoute>
            )}
          />
          <Route
            path="/teacher/classes"
            element={(
              <ProtectedRoute>
                <RoleGuard role="teacher">
                  <ClassesPage />
                </RoleGuard>
              </ProtectedRoute>
            )}
          />
          <Route
            path="/teacher/upload"
            element={(
              <ProtectedRoute>
                <RoleGuard role="teacher">
                  <TeacherPage />
                </RoleGuard>
              </ProtectedRoute>
            )}
          />
          <Route
            path="/teacher/students"
            element={(
              <ProtectedRoute>
                <RoleGuard role="teacher">
                  <TeacherPage />
                </RoleGuard>
              </ProtectedRoute>
            )}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute allowGuest>
                <RoleAwareDashboard onRestartOnboarding={handleRestartOnboarding} />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/profile"
            element={(
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            )}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      {showOnboarding && isAuthenticated && userRole !== "teacher" && !isAuthScreen && (
        <OnboardingContainer onComplete={handleOnboardingComplete} />
      )}
    </div>
  );
}
