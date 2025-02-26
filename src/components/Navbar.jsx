import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import { onAuthStateChanged, signInWithCustomToken, signOut } from "firebase/auth";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/rosefire.min.js"; 
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser || null);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    if (!window.Rosefire) {
      console.error("Rosefire SDK not loaded!");
      return;
    }

    window.Rosefire.signIn("62c320b3-a749-4d11-9994-4ce75959e8c5", async (err, rfUser) => {
      if (err) {
        console.error("Rosefire error!", err);
        return;
      }

      try {
        await signInWithCustomToken(auth, rfUser.token);
        console.log("Firebase login successful!");
      } catch (error) {
        console.error("Firebase Auth Error:", error.message);
      }
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
    console.log("User logged out");
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-20 px-8 py-4 bg-white bg-opacity-60 backdrop-blur-lg shadow-md flex justify-between items-center z-50">
      <h1 className="text-gray-900 text-2xl font-bold tracking-wide">Rose Reviews</h1>
      
      <div className="space-x-6 text-gray-800 font-medium flex items-center">
        <Link to="/" className="hover:text-red-500 transition">Home</Link>
        <Link to="/courses" className="hover:text-red-500 transition">Courses</Link>
        <Link to="/profs" className="hover:text-red-500 transition">Professors</Link>
        <Link to="/allreviews" className="hover:text-red-500 transition">Reviews</Link>

        <Link to="/review">
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition">
            Submit Review
          </button>
        </Link>

        {!user ? (
          <button onClick={handleLogin} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
            Login
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            <span className="text-gray-900 font-medium">{user.displayName || "User"}</span>
            <button onClick={handleLogout} className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
