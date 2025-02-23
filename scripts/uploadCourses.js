import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { db } from "../src/config/firebase.js";  // Correct path

const asCourses = [
    { code: "AS 101", name: "Heritage and Values I" },
    { code: "AS 101L", name: "Leadership Laboratory" },
    { code: "AS 102", name: "Heritage and Values II" },
    { code: "AS 102L", name: "Leadership Laboratory" },
    { code: "AS 103", name: "Heritage and Values III" },
    { code: "AS 103L", name: "Leadership Laboratory" },
    { code: "AS 201", name: "Team and Leadership Fundamentals I" },
    { code: "AS 201L", name: "Leadership Laboratory" },
    { code: "AS 202", name: "Team and Leadership Fundamentals II" },
    { code: "AS 202L", name: "Leadership Laboratory" },
    { code: "AS 203", name: "Team and Leadership Fundamentals III" },
    { code: "AS 203L", name: "Leadership Laboratory" },
    { code: "AS 301", name: "Leading People and Effective Communication I" },
    { code: "AS 301L", name: "Leadership Laboratory" },
    { code: "AS 302", name: "Leading People and Effective Communication II" },
    { code: "AS 302L", name: "Leadership Laboratory" },
    { code: "AS 303", name: "Leading People and Effective Communication III" },
    { code: "AS 303L", name: "Leadership Laboratory" },
    { code: "AS 401", name: "National Security and Preparation for Active Duty I" },
    { code: "AS 401L", name: "Leadership Laboratory" },
    { code: "AS 402", name: "National Security and Preparation for Active Duty II" },
    { code: "AS 402L", name: "Leadership Laboratory" },
    { code: "AS 403", name: "National Security and Preparation for Active Duty III" },
    { code: "AS 403L", name: "Leadership Laboratory" }
];

const msCourses = [
    { code: "MS 101", name: "Introduction to the Army and Critical Thinking" },
    { code: "MS 102", name: "Adaptive Leadership & Professional Competence" },
    { code: "MS 103", name: "Basic Tactical Leadership" },
    { code: "MS 201", name: "Leadership and Decision Making" },
    { code: "MS 202", name: "Army Doctrine & Team Development" },
    { code: "MS 203", name: "Foundations of Tactical Leadership II" },
    { code: "MS 206", name: "ROTC Cadet Initial Entry Training Course" },
    { code: "MS 301", name: "Training Management and the Warfighting Functions" },
    { code: "MS 302", name: "Applied Leadership in Small Unit Operations" },
    { code: "MS 303", name: "Leadership under Fire II" },
    { code: "MS 401", name: "Mission Command & Ethics" },
    { code: "MS 402", name: "Mission Command and the Army" },
    { code: "MS 403", name: "Leadership in a Complex World II" },
    { code: "MS 497", name: "Military Science Independent Study" },
    { code: "MS 498", name: "Overview of CLC Cadet Leader Course" }
];

const uploadCourses = async () => {
    for (const course of asCourses) {
        await setDoc(doc(collection(db, "courses"), course.code), {
            department: "ROTC Airforce",
            name: course.name,
            code: course.code,
        });
        console.log(`✅ Added: ${course.code} - ${course.name}`);
    }

    for (const course of msCourses) {
        await setDoc(doc(collection(db, "courses"), course.code), {
            department: "ROTC Army",
            name: course.name,
            code: course.code,
        });
        console.log(`✅ Added: ${course.code} - ${course.name}`);
    }

    console.log("🔥 All ROTC Airforce & ROTC Army courses uploaded!");
};

uploadCourses();
