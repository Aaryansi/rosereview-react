import { Link } from "react-router-dom";
import { auth } from "../config/firebaseConfig";
import { signOut } from "firebase/auth";

export default function Navbar({ user }) {
  const handleLogout = async () => {
    await signOut(auth);
    console.log("User logged out");
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-20 px-8 py-4 bg-white shadow-md flex justify-between items-center z-50">
      <h1 className="text-gray-900 text-2xl font-bold">Rose Reviews</h1>

      <div className="space-x-6 text-gray-800 font-medium flex items-center">
        <Link to="/" className="hover:text-red-500 transition">Home</Link>
        <Link to="/courses" className="hover:text-red-500 transition">Courses</Link>
        <Link to="/profs" className="hover:text-red-500 transition">Professors</Link>
        <Link to="/allreviews" className="hover:text-red-500 transition">Reviews</Link>

        {/* Always Show "Submit a Review" Button */}
        <Link to="/review">
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition">
            Submit Review
          </button>
        </Link>

        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-900">{user.displayName || "User"}</span>
            <button onClick={handleLogout} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
