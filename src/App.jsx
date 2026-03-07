import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import OnboardingContainer from "./components/onboarding/OnboardingContainer";
import { isOnboardingComplete, resetOnboarding } from "./onboarding/onboardingStorage";
import Home from "./pages/Home";
import CareerPath from "./pages/CareerPath";
import CareerQuiz from "./pages/CareerQuiz";
import CollegeMatch from "./pages/CollegeMatch";
import CollegeQuiz from "./pages/CollegeQuiz";
import MoneySkills from "./pages/MoneySkills";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const location = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(() => !isOnboardingComplete());

  useEffect(() => {
    const titles = {
      "/": "NextStep | Student Future Planning",
      "/career": "NextStep | Career Path Module",
      "/career/quiz": "NextStep | Career Quiz",
      "/college": "NextStep | College Match Module",
      "/college/quiz": "NextStep | College Match Quiz",
      "/money": "NextStep | Money Skills Module",
      "/dashboard": "NextStep | Learning Hub"
    };
    document.title = titles[location.pathname] ?? "NextStep | Student Future Planning";
  }, [location.pathname]);

  function handleOnboardingComplete() {
    setShowOnboarding(false);
  }

  function handleRestartOnboarding() {
    resetOnboarding();
    setShowOnboarding(true);
  }

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
          <Route path="/dashboard" element={<Dashboard onRestartOnboarding={handleRestartOnboarding} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      {showOnboarding && <OnboardingContainer onComplete={handleOnboardingComplete} />}
    </div>
  );
}
