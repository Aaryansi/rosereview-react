import { useState, useEffect } from "react";
import { getCourses, getProfessors, submitReview } from "../../utils/firestore";
import { Timestamp } from "firebase/firestore";
import { FaStar, FaTimes } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";  // ✅ Import this to read URL parameters


export default function FeedbackForm({ initialCourse = "", initialProfessor = "" }) {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(initialCourse);
  const [selectedProfessor, setSelectedProfessor] = useState(initialProfessor);
  const [comments, setComments] = useState("");
  const [courseTags, setCourseTags] = useState([]);
  const [professorTags, setProfessorTags] = useState([]);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const courseParam = searchParams.get("course");
  const courseName = searchParams.get("name");
  const professorParam = searchParams.get("professor");

  const availableCourseTags = [
    "Easy Grader", "Tough Exams", "Fair Assignments",
    "Heavy Workload", "Light Workload", "Great Lectures",
    "Practical Focus", "Challenging but Rewarding",
    "Project-Based", "Curve Adjusted", "Unorganized"
  ];
  const availableProfessorTags = [
    "Helpful", "Strict", "Engaging",
    "Fast-Paced", "Slow-Paced", "Encouraging",
    "Hard to Understand", "Lots of Extra Credit",
    "Tough Grader", "Great Feedback", "Late Responses"
  ];

  useEffect(() => {
    async function fetchData() {
      const allCourses = await getCourses();
      setCourses(allCourses);
      setDepartments([...new Set(allCourses.map((c) => c.department))]);

      const allProfessors = await getProfessors();
      setProfessors(allProfessors);

      // ✅ Auto-fill course and department if passed from URL
      if (courseParam) {
        setSelectedCourse(courseParam);
        const course = allCourses.find((c) => c.code === courseParam);
        if (course) {
          setSelectedDepartment(course.department);
        }
      }

      // ✅ Set Professor if passed via URL
      if (professorParam) {
        setSelectedProfessor(professorParam);
      }

      // ✅ Auto-fill professor if passed from URL
      if (professorParam) {
        setSelectedProfessor(professorParam);
      }
    }
    fetchData();
  }, []);

  // Filter courses based on selected department
  const filteredCourses = selectedDepartment
    ? courses.filter((c) => c.department === selectedDepartment)
    : courses;

  // Automatically set department when course is selected
  useEffect(() => {
    if (selectedCourse) {
      const course = courses.find((c) => c.code === selectedCourse);
      if (course) {
        setSelectedDepartment(course.department);
      }
    }
  }, [selectedCourse, courses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!selectedCourse || rating === 0) {
      alert("Please select a course and provide a rating.");
      setLoading(false);
      return;
    }
  
    try {
      await submitReview({
        department: selectedDepartment,
        courseId: selectedCourse.trim(),
        professorId: selectedProfessor || null,
        comments,
        courseTags: [...courseTags],  // ✅ Ensure the array is stored properly
        professorTags: [...professorTags], // ✅ Ensure the array is stored properly
        rating,
        timestamp: Timestamp.now(),
      });
  
      alert("Review submitted successfully!");
      setComments("");
      setCourseTags([]);
      setProfessorTags([]);
      setRating(0);
      if (!initialCourse) setSelectedCourse("");
      if (!initialProfessor) setSelectedProfessor("");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Try again.");
    }
  
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white/40 backdrop-blur-md rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Submit a Review</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Department Selection */}
        <label className="block">
          <span className="text-gray-700 font-semibold">Department</span>
          <select
            className="w-full mt-1 p-3 rounded-md border bg-white"
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              setSelectedCourse(""); // Reset course when department changes
            }}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </label>

        {/* Course Selection */}
        <label className="block">
          <span className="text-gray-700 font-semibold">Course</span>
          <select
            className="w-full mt-1 p-3 rounded-md border bg-white"
            value={selectedCourse || ""}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Select Course</option>
            {filteredCourses.map((course) => (
              <option key={course.code} value={course.code}>
                {course.name} ({course.code})
              </option>
            ))}
          </select>
        </label>

        {/* Professor Selection (Global, No Filtering) */}
        <label className="block">
          <span className="text-gray-700 font-semibold">Professor </span>
          <select
            className="w-full mt-1 p-3 rounded-md border bg-white"
            value={selectedProfessor || ""}
            onChange={(e) => setSelectedProfessor(e.target.value)}
          >
            <option value="">Select Professor</option>
            {professors.map((prof) => (
              <option key={prof.id} value={prof.id}>
                {prof.name}
              </option>
            ))}
          </select>
        </label>

        {/* Rating */}
        <label className="block">
          <span className="text-gray-700 font-semibold">Rating</span>
          <div className="flex space-x-2 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer text-3xl transition ${star <= rating ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"}`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          {rating === 0 && <p className="text-red-500 text-sm mt-1">Please select a rating before submitting.</p>}
        </label>

        {/* Course Tags Selection */}
        <label className="block">
          <span className="text-gray-700 font-semibold">Course:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {availableCourseTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`px-3 py-2 rounded-lg text-sm ${courseTags.includes(tag) ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                onClick={() =>
                  setCourseTags((prevTags) =>
                    prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
                  )
                }
              >
                {tag}
              </button>
            ))}
          </div>
        </label>

        {/* Professor Tags Selection */}
        <label className="block">
          <span className="text-gray-700 font-semibold">Professor:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {availableProfessorTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`px-3 py-2 rounded-lg text-sm ${professorTags.includes(tag) ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                onClick={() =>
                  setProfessorTags((prevTags) =>
                    prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
                  )
                }
              >
                {tag}
              </button>
            ))}
          </div>
        </label>

        {/* Comments */}
        <label className="block">
          <span className="text-gray-700 font-semibold">Comments</span>
          <textarea
            className="w-full mt-1 p-3 rounded-md border bg-white"
            rows="4"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Write your review..."
          ></textarea>
        </label>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition" disabled={loading}>
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
