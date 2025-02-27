import { getFirestore, collection, addDoc } from "firebase/firestore";
import { db } from "../src/config/firebase.js";  // Correct path

const professors = [
    { name: "Jaime Albarran", departments: ["Air Force ROTC"] },
    { name: "Kevin Dean", departments: ["Air Force ROTC"] },
    { name: "Harper Kristoffer-Rommell", departments: ["Air Force ROTC"] },
    { name: "Earon Laswell", departments: ["Air Force ROTC"] },
    { name: "Zach Reinebold", departments: ["Air Force ROTC"] },
    { name: "Melissa Wethington", departments: ["Air Force ROTC"] },

    { name: "James Antonides", departments: ["Army ROTC"] },
    { name: "Ryan Burnett", departments: ["Army ROTC"] },
    { name: "Lance Cole", departments: ["Army ROTC"] },
    { name: "Thomas Deal", departments: ["Army ROTC"] },
    { name: "Robert Doll", departments: ["Army ROTC"] },
    { name: "Bryar Nevins", departments: ["Army ROTC"] },
    { name: "Rafael Ramirez", departments: ["Army ROTC"] },
    { name: "Ivan Sehovic", departments: ["Army ROTC"] },
    { name: "Derek Snyder", departments: ["Army ROTC"] },
    { name: "Sam Valentine", departments: ["Army ROTC"] }
];

const uploadProfessors = async () => {
    for (const prof of professors) {
        await addDoc(collection(db, "profs"), {
            name: prof.name,
            departments: prof.departments
        });
        console.log(` Added: ${prof.name}`);
    }
    console.log("All ROTC professors uploaded successfully!");
};

uploadProfessors();
