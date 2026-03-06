import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CareerPath from "./pages/CareerPath";
import CollegeMatch from "./pages/CollegeMatch";
import MoneySkills from "./pages/MoneySkills";
import Dashboard from "./pages/Dashboard";

export default function App() {
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
    </div>
  );
}
