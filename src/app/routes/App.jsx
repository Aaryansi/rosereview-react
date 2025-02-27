import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../../config/firebaseConfig"; 
import { onAuthStateChanged } from "firebase/auth";

import Home from "./Home";
import Courses from "./Courses";
import Profs from "./Profs";
import Review from "./Review";
import AllReviews from "./Allreviews";
import Navbar from "../../components/Navbar";
import Footer from "./Footer";
import Login from "./Login";
import LoginPopup from "../../components/LoginPopup"; 


export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Router basename="/">
      <Navbar user={user} />
      <div className="pt-20">
        <Routes>
          {!user ? (
            <Route path="/*" element={<LoginPopup />} /> 
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/profs" element={<Profs />} />
              <Route path="/review" element={<Review />} />
              <Route path="/allreviews" element={<AllReviews user = {user} />} />
            </>
          )}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
