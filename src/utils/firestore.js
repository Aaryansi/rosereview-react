import { db } from "../config/firebase";
import { 
  collection, getDocs, doc, getDoc, query, where, addDoc, deleteDoc, updateDoc // Added updateDoc
} from "firebase/firestore";

/** 📌 Fetch all courses */
export const getCourses = async () => {
  const querySnapshot = await getDocs(collection(db, "courses"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/** 📌 Fetch all professors */
export const getProfessors = async () => {
  const querySnapshot = await getDocs(collection(db, "profs"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/** 📌 Fetch all departments from courses */
export const getDepartments = async () => {
  const querySnapshot = await getDocs(collection(db, "courses"));
  const departments = new Set(querySnapshot.docs.map((doc) => doc.data().department));
  return Array.from(departments);
};

/** 📌 Fetch courses by department */
export const getCoursesByDepartment = async (department) => {
  const q = query(collection(db, "courses"), where("department", "==", department));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/** 📌 Fetch professors by department */
export const getProfessorsByDepartment = async (department) => {
  const q = query(collection(db, "profs"), where("departments", "array-contains", department));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/** 📌 Fetch professor details by ID */
export const getProfessorById = async (professorId) => {
  const docRef = doc(db, "profs", professorId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

/** 📌 Fetch reviews by Course ID */
export const getReviewsByCourse = async (courseId) => {
  try {
    console.log(`Fetching reviews for Course ID: ${courseId}`);
    const q = query(collection(db, "reviews"), where("courseId", "==", courseId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

/** 📌 Fetch reviews by Professor ID */
export const getReviewsByProfessor = async (professorId) => {
  try {
    console.log(`Fetching reviews for Professor ID: ${professorId}`);
    const q = query(collection(db, "reviews"), where("professorId", "==", professorId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

/** 📌 Submit a new review */
export const submitReview = async (reviewData) => {
  try {
    const docRef = await addDoc(collection(db, "reviews"), reviewData);
    console.log("Review submitted with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};



export const getAllReviews = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "reviews"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    return [];
  }
};



/** 📌 Update Review */
export const updateReview = async (reviewId, updatedData) => {
  try {
    const reviewRef = doc(db, "reviews", reviewId);
    await updateDoc(reviewRef, updatedData);
    console.log("Review updated successfully");
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

/** 📌 Delete Review */
export const deleteReview = async (reviewId) => {
  try {
    await deleteDoc(doc(db, "reviews", reviewId));
    console.log("Review deleted successfully");
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};