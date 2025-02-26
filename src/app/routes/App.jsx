import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Courses from "./Courses";
import Profs from "./Profs";
import Review from "./Review";
import AllReviews from "./Allreviews";
import Navbar from "../../components/Navbar";
import Footer from "./Footer"; // ✅ Ensure correct path



export default function App() {
  return (
    <Router basename="/">
      <Navbar />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/profs" element={<Profs />} />
          <Route path="/review" element={<Review />} />
          <Route path="/allreviews" element={<AllReviews />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
