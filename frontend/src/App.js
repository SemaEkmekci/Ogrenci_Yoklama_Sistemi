import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import InstructorPage from "./pages/InstructorPage";
import StudentPage from "./pages/StudentPage";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/instructor" element={<InstructorPage />} />
            <Route path="/student" element={<StudentPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
