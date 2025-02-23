import { useEffect, useState } from "react";
import { getAllReviews, getCourses, getProfessors, deleteReview, updateReview } from "../../utils/firestore";
import { FaSearch, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AllReviews() {
  const [reviews, setReviews] = useState([]);
  const [courses, setCourses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [editingReview, setEditingReview] = useState(null);
  const [updatedCourse, setUpdatedCourse] = useState("");
  const [updatedProfessor, setUpdatedProfessor] = useState("");
  const [updatedComments, setUpdatedComments] = useState("");
  const [updatedTags, setUpdatedTags] = useState([]);
  const [updatedRating, setUpdatedRating] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsData, coursesData, professorsData] = await Promise.all([
          getAllReviews(),
          getCourses(),
          getProfessors(),
        ]);
        setReviews(reviewsData);
        setCourses(coursesData);
        setProfessors(professorsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.code === courseId);
    return course ? `${course.code} - ${course.name}` : "Unknown Course";
  };

  const getProfessorName = (professorId) => {
    const prof = professors.find((p) => p.id === professorId);
    return prof ? prof.name : "Unknown Professor";
  };

  // Filtering Reviews
  const filteredReviews = reviews.filter((review) => {
    const course = review.courseId ? getCourseName(review.courseId).toLowerCase() : "";
    const professor = review.professorId ? getProfessorName(review.professorId).toLowerCase() : "";
    const department = review.department ? String(review.department).toLowerCase() : "";

    const searchMatch =
      course.includes(searchTerm.toLowerCase()) ||
      professor.includes(searchTerm.toLowerCase()) ||
      department.includes(searchTerm.toLowerCase());

    const tagMatch = filterTag ? (review.tags && Array.isArray(review.tags) ? review.tags.includes(filterTag) : false) : true;

    return searchMatch && tagMatch;
  });

  // Sorting Reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortOption === "newest") return (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0);
    if (sortOption === "oldest") return (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0);
    return 0;
  });

  // Delete Review
  const handleDelete = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await deleteReview(reviewId);
      setReviews(reviews.filter((r) => r.id !== reviewId));
    }
  };

  // Edit Review
  const handleEdit = (review) => {
    setEditingReview(review);
    setUpdatedCourse(review.courseId || "");
    setUpdatedProfessor(review.professorId || "");
    setUpdatedComments(review.comments || "");
    setUpdatedTags(review.tags || []);
    setUpdatedRating(review.rating || 0);
    setIsEditing(true);
  };

  // Update Review
  const handleUpdate = async () => {
    if (!editingReview) return;
    await updateReview(editingReview.id, {
      courseId: updatedCourse,
      professorId: updatedProfessor,
      comments: updatedComments,
      tags: updatedTags,
      rating: updatedRating,
    });
    setReviews(
      reviews.map((r) =>
        r.id === editingReview.id
          ? { ...r, courseId: updatedCourse, professorId: updatedProfessor, comments: updatedComments, tags: updatedTags, rating: updatedRating }
          : r
      )
    );
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">All Reviews</h1>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap gap-4 justify-center items-center mb-10">
        <div className="relative w-full md:w-2/3 lg:w-1/2">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
          <input
            type="text"
            placeholder="Search by course, professor, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-12 border rounded-xl shadow-lg bg-white focus:ring-2 focus:ring-red-500 focus:outline-none transition-all text-lg"
          />
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedReviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition">
            <h2 className="text-xl font-semibold text-gray-900">
              {getCourseName(review.courseId)} - {getProfessorName(review.professorId)}
            </h2>
            <p className="text-gray-600">{review.department || "Unknown Department"}</p>
            <p className="text-gray-800 mt-2">{review.comments}</p>
            <p className="text-sm text-gray-500 mt-1">{review.tags?.join(", ") || "No tags"}</p>

            {/* Star Rating */}
            <div className="flex space-x-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} className={`text-xl ${star <= review.rating ? "text-yellow-500" : "text-gray-300"}`} />
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={() => handleEdit(review)} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                Edit
              </button>
              <button onClick={() => handleDelete(review.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold">Edit Review</h2>
            <textarea
              className="w-full mt-2 p-2 border rounded-md"
              value={updatedComments}
              onChange={(e) => setUpdatedComments(e.target.value)}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {["Tag1", "Tag2", "Tag3"].map((tag) => (
                <button
                  key={tag}
                  className={`px-2 py-1 border rounded-md ${updatedTags.includes(tag) ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  onClick={() =>
                    setUpdatedTags((prevTags) =>
                      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
                    )
                  }
                >
                  {tag}
                </button>
              ))}
            </div>
            <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg" onClick={handleUpdate}>
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
