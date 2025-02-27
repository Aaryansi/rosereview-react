import { useEffect, useState } from "react";
import { getCourses, getReviewsByCourse } from "../../utils/firestore";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [reviewsMap, setReviewsMap] = useState({});
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await getCourses();
        const validCourses = courseData.filter(course => course.code && course.department); 
        setCourses(validCourses);

        // Fetch reviews for all courses to calculate trending courses
        const reviewsPromises = validCourses.map(async (course) => {
          const reviews = await getReviewsByCourse(course.code);
          return { courseId: course.code, reviews };
        });

        const reviewsResults = await Promise.all(reviewsPromises);
        const reviewsObj = {};
        reviewsResults.forEach(({ courseId, reviews }) => {
          reviewsObj[courseId] = reviews;
        });
        setReviewsMap(reviewsObj);

        // Calculate trending courses: Sort by number of reviews
        const trending = [...validCourses]
          .map((course) => ({
            ...course,
            reviewCount: reviewsObj[course.code]?.length || 0,
            avgRating: reviewsObj[course.code]?.length > 0
              ? (reviewsObj[course.code].reduce((acc, r) => acc + (r.rating || 0), 0) / reviewsObj[course.code].length).toFixed(1)
              : "No Rating",
          }))
          .sort((a, b) => b.reviewCount - a.reviewCount)
          .slice(0, 5); // Only show top 5 trending courses

        setTrendingCourses(trending);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchData();
  }, []);

  const departments = [...new Set(courses.map((course) => course.department).filter(Boolean))];

  // Global search functionality
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCourses([]);
      return;
    }

    const matchedCourses = courses.filter((course) => {
      const courseName = course.name ? course.name.toLowerCase() : "";
      const courseCode = course.code ? course.code.toLowerCase() : "";
      return courseName.includes(searchTerm.toLowerCase()) || courseCode.includes(searchTerm.toLowerCase());
    });

    setFilteredCourses(matchedCourses);

    if (matchedCourses.length > 0 && matchedCourses[0].department) {
      setSelectedDepartment(matchedCourses[0].department);
    }
  }, [searchTerm, courses]);

  return (
    <div className="pt-20 relative min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center px-6 py-12">
      <h1 className="text-5xl font-extrabold text-gray-900 text-center drop-shadow-lg">Browse Courses</h1>
      <p className="text-lg text-gray-600 mt-2 text-center">
        Explore courses by department or search for a specific course.
      </p>

      {/* Search Bar */}
      <div className="relative w-full md:w-2/3 lg:w-1/2 mt-6">
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
        <input
          type="text"
          placeholder="Search for a course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 pl-12 border rounded-xl shadow-lg bg-white focus:ring-2 focus:ring-red-500 focus:outline-none transition-all text-lg"
        />
      </div>

      {/* Department Filter */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 w-full max-w-7xl">
        {departments.map((department) => (
          <button
            key={department}
            onClick={() => setSelectedDepartment(department)}
            className={`glass-card px-6 py-4 text-center font-semibold transition transform hover:scale-105 rounded-lg shadow-md ${selectedDepartment === department ? "bg-red-600 text-white" : "bg-white/40 text-gray-900 hover:bg-white/50"
              }`}
          >
            {department}
          </button>
        ))}
      </div>

      {/* Display Courses */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(filteredCourses.length > 0 ? filteredCourses : courses.filter((c) => c.department === selectedDepartment)).map(
          (course) => {
            const courseReviews = reviewsMap[course.code] || [];
            return (
              <div key={course.id} className="glass-card p-6 rounded-lg shadow-xl hover:shadow-2xl transition transform hover:scale-105 cursor-pointer relative">
                <h2 className="text-xl font-semibold text-gray-900">
                  {course.name} ({course.code})
                </h2>
                <p className="text-gray-500">{course.department}</p>
                <p className="text-gray-600 mt-2">
                  ⭐ {courseReviews.length > 0 ? (courseReviews.reduce((acc, r) => acc + (r.rating || 0), 0) / courseReviews.length).toFixed(1) : "No Rating"}
                </p>
                <p className="text-gray-600">📌 {courseReviews.length} Reviews</p>
                <Link to={`/review?course=${course.code}&name=${encodeURIComponent(course.name)}`}>
                  <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Submit a Review
                  </button>
                </Link>
              </div>
            );
          }
        )}
      </div>

      {/* Trending Courses Section */}
      <div className="mt-12 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-gray-900 text-center">🔥 Trending Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {trendingCourses.map((course) => (
            <div key={course.id} className="glass-card p-6 rounded-lg shadow-lg hover:shadow-2xl transition transform hover:scale-105 cursor-pointer">
              <h3 className="text-xl font-semibold text-gray-900">
                {course.name} ({course.code})
              </h3>
              <p className="text-gray-600">📌 {course.reviewCount} Reviews</p>
              <p className="text-gray-600">⭐ {course.avgRating}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
