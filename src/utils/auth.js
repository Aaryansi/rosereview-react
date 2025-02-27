
import { auth } from "../config/firebaseConfig";
import { signInWithCustomToken, signOut, onAuthStateChanged } from "firebase/auth";

const ROSEFIRE_REGISTRY_TOKEN = "62c320b3-a749-4d11-9994-4ce75959e8c5"; 
export const signInWithRosefire = async () => {
  return new Promise((resolve, reject) => {
    // Ensure Rosefire is loaded before calling signIn
    if (!window.Rosefire) {
      reject(new Error("Rosefire script not loaded!"));
      return;
    }

    window.Rosefire.signIn(ROSEFIRE_REGISTRY_TOKEN, async (err, rfUser) => {
      if (err) {
        console.error("Rosefire error:", err);
        reject(err);
        return;
      }

      try {
        // Authenticate with Firebase using Rosefire token
        const userCredential = await signInWithCustomToken(auth, rfUser.token);
        resolve(userCredential.user);
      } catch (error) {
        console.error("Firebase authentication failed:", error.message);
        reject(error);
      }
    });
  });
};

export const signOutUser = async () => {
  await signOut(auth);
};

export const authStateListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};
