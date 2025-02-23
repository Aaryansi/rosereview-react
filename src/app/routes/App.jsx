import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Courses from "./Courses";
//import "../../../scripts/uploadCourses";  // Import it ONCE and remove after running

import Profs from "./Profs";
import Review from "./Review";
import AllReviews from "./Allreviews"; // Ensure the casing matches the actual file name
import Navbar from "../../components/Navbar"; 

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-20"> {/* Adds padding so content starts below navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/profs" element={<Profs />} />
          <Route path="/review" element={<Review />} />
          <Route path="/allreviews" element={<AllReviews />} />
        </Routes>
      </div>
    </Router>
  );
}
