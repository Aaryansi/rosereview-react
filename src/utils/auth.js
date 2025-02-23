import firebase from "../config/firebaseConfig";
import Rosefire from "rosefire"; // Import Rosefire

const ROSEFIRE_REGISTRY_TOKEN = "62c320b3-a749-4d11-9994-4ce75959e8c5"; // Replace with your Rosefire Registry Token

/** 🚀 Function to Sign in with Rosefire */
export const signInWithRosefire = async () => {
  return new Promise((resolve, reject) => {
    Rosefire.signIn(ROSEFIRE_REGISTRY_TOKEN, async (err, rfUser) => {
      if (err) {
        console.error("❌ Rosefire error:", err);
        reject(err);
        return;
      }

      console.log("✅ Rosefire success!", rfUser);

      try {
        // Authenticate with Firebase using Rosefire token
        const userCredential = await firebase.auth().signInWithCustomToken(rfUser.token);
        console.log("✅ Firebase login success:", userCredential.user);
        resolve(userCredential.user);
      } catch (error) {
        console.error("❌ Firebase authentication failed:", error.message);
        reject(error);
      }
    });
  });
};

/** 👀 Listener to track authentication state */
export const authStateListener = (callback) => {
  firebase.auth().onAuthStateChanged((user) => {
    callback(user);
  });
};

/** 🚪 Logout function */
export const signOut = async () => {
  try {
    await firebase.auth().signOut();
    console.log("✅ User logged out successfully");
  } catch (error) {
    console.error("❌ Error logging out:", error.message);
  }
};
