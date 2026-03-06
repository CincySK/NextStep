import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CareerPath from "./pages/CareerPath";
import CollegeMatch from "./pages/CollegeMatch";
import MoneySkills from "./pages/MoneySkills";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      "/": "NextStep | Student Future Planning",
      "/career": "NextStep | Career Path Module",
      "/college": "NextStep | College Match Module",
      "/money": "NextStep | Money Skills Module",
      "/dashboard": "NextStep | Learning Hub"
    };
    document.title = titles[location.pathname] ?? "NextStep | Student Future Planning";
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <Navbar />
      <main className="container page-wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/career" element={<CareerPath />} />
          <Route path="/college" element={<CollegeMatch />} />
          <Route path="/money" element={<MoneySkills />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
