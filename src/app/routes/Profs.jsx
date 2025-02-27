import { useEffect, useState } from "react";
import { getProfessors, getReviewsByProfessor } from "../../utils/firestore";

import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Professors() {
  const [professors, setProfessors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [reviewsMap, setReviewsMap] = useState({});
  const [trendingProfessors, setTrendingProfessors] = useState([]);
  const [filteredProfessors, setFilteredProfessors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profData = await getProfessors();
        setProfessors(profData);

        // Fetch reviews for all professors
        const reviewsPromises = profData.map(async (prof) => {
          const reviews = await getReviewsByProfessor(prof.id);
          return { professorId: prof.id, reviews };
        });

        const reviewsResults = await Promise.all(reviewsPromises);
        const reviewsObj = {};
        reviewsResults.forEach(({ professorId, reviews }) => {
          reviewsObj[professorId] = reviews;
        });
        setReviewsMap(reviewsObj);

        // Calculate trending professors (most reviewed)
        const trending = [...profData]
          .map((prof) => ({
            ...prof,
            reviewCount: reviewsObj[prof.id]?.length || 0,
          }))
          .sort((a, b) => b.reviewCount - a.reviewCount)
          .slice(0, 5);
        setTrendingProfessors(trending);
      } catch (error) {
        console.error("Error fetching professors:", error);
      }
    };
    fetchData();
  }, []);

  const departments = [...new Set(professors.flatMap((prof) => prof.departments || []))];

  // 🔹 **Global Search Logic**
  useEffect(() => {
    if (searchTerm) {
      const foundProfessors = professors.filter((prof) => {
        const nameMatch = prof.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const departmentMatch = prof.departments?.some((dept) =>
          dept.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return nameMatch || departmentMatch;
      });

      setFilteredProfessors(foundProfessors);

      if (foundProfessors.length > 0) {
        const dept = foundProfessors[0].departments?.[0] || null;
        setSelectedDepartment(dept);
      }
    } else {
      setFilteredProfessors([]);
    }
  }, [searchTerm, professors]);

  // 🔹 **Filter Professors by Department**
  useEffect(() => {
    if (selectedDepartment) {
      setFilteredProfessors(
        professors.filter((prof) => prof.departments?.includes(selectedDepartment))
      );
    } else {
      setFilteredProfessors([]);
    }
  }, [selectedDepartment, professors]);

  return (
    <div className="pt-20 relative min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center px-6 py-12">
      <h1 className="text-5xl font-extrabold text-gray-900 text-center drop-shadow-lg">
        Browse Professors
      </h1>
      <p className="text-lg text-gray-600 mt-2 text-center">
        Search for professors or filter by department.
      </p>

      {/* 🔎 Search Bar */}
      <div className="relative w-full md:w-1/2 mt-6">
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search for a professor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-12 border rounded-xl shadow-lg bg-white focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
        />
      </div>

      {/* 🏛️ Department Filter (Visible First) */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDepartment(dept === selectedDepartment ? null : dept)}
            className={`glass-card px-6 py-4 text-center font-semibold transition transform hover:scale-105 rounded-lg shadow-md ${selectedDepartment === dept ? "bg-red-600 text-white" : "bg-white/40 text-gray-900 hover:bg-white/50"
              }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* 👨‍🏫 Professors Grid (Appears only when searched or department selected) */}
      {filteredProfessors.length > 0 && (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProfessors.map((prof) => {
            const profReviews = reviewsMap[prof.id] || [];
            return (
              <div
                key={prof.id}
                className="glass-card p-6 rounded-lg shadow-xl hover:shadow-2xl transition transform hover:scale-105 cursor-pointer relative"
              >
                <h2 className="text-xl font-semibold text-gray-900">{prof.name}</h2>
                <p className="text-gray-500">{prof.departments?.join(", ") || "Unknown Department"}</p>
                <p className="text-gray-600 mt-2">
                  ⭐ {profReviews.length > 0 ? (profReviews.reduce((acc, r) => acc + (r.rating || 0), 0) / profReviews.length).toFixed(1) : "No Rating"}
                </p>
                <p className="text-gray-600">📌 {profReviews.length} Reviews</p>
                {profReviews.length > 0 ? (
                  <div className="mt-4 flex gap-2">
                    {/* <Link href={`/review?professor=${prof.id}`}>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        Submit a Review
                      </button>
                    </Link> */}
                    <Link to={`/allreviews?professor=${prof.id}`}>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        View Reviews
                      </button>
                    </Link>
                  </div>
                ) : (
                  <Link to={`/review?professor=${prof.id}&name=${encodeURIComponent(prof.name)}`}>
                    <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      Submit a Review
                    </button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 🔥 Trending Professors */}
      <div className="mt-12 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Trending Professors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {trendingProfessors.map((prof) => (
            <div
              key={prof.id}
              className="glass-card p-6 rounded-lg shadow-lg hover:shadow-2xl transition transform hover:scale-105 cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-gray-900">{prof.name}</h3>
              <p className="text-gray-600">📌 {prof.reviewCount} Reviews</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
