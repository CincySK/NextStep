import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
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
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import StudyAssistant from "./pages/StudyAssistant";
import ClassesPage from "./pages/ClassesPage";
import ClassDetailPage from "./pages/ClassDetailPage";
import AssignmentDetailPage from "./pages/AssignmentDetailPage";
import TeacherPage from "./pages/TeacherPage";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(() => {
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
      "/forgot-password": "NextStep | Reset Password",
      "/profile": "NextStep | Profile",
      "/study-assistant": "NextStep | Study Assistant",
      "/classes": "NextStep | My Classes",
      "/teacher": "NextStep | Teacher Dashboard"
    };
    document.title = titles[location.pathname] ?? "NextStep | Student Future Planning";
  }, [location.pathname]);

  useEffect(() => {
    const state = loadOnboardingState();
    const draft = loadOnboardingDraft();
    if (isOnboardingComplete()) return;
    if (!state?.primaryPath) return;
    if (draft) return;
    if (location.pathname !== "/") return;
    const target = state.primaryPath === "career"
      ? "/career/quiz"
      : state.primaryPath === "college"
        ? "/college/quiz"
        : "/money";
    navigate(target);
  }, [location.pathname, navigate]);

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

  const isAuthScreen = ["/login", "/signup", "/forgot-password"].includes(location.pathname);

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
          <Route path="/career" element={<CareerPath />} />
          <Route path="/career/quiz" element={<CareerQuiz />} />
          <Route path="/college" element={<CollegeMatch />} />
          <Route path="/college/quiz" element={<CollegeQuiz />} />
          <Route path="/money" element={<MoneySkills />} />
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
                <TeacherPage />
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
                <Dashboard onRestartOnboarding={handleRestartOnboarding} />
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
      {showOnboarding && !isAuthScreen && <OnboardingContainer onComplete={handleOnboardingComplete} />}
    </div>
  );
}
