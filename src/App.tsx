import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SimulatorPage from "./pages/SimulatorPage";
import LandingPage from "./pages/LandingPage";
import LearnPage from "./pages/LearnPage";
import DocsPage from "./pages/DocsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/simulator" element={<SimulatorPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/docs" element={<DocsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
