"use client";

import { useEffect, useState } from "react";
import { auth } from "../config/firebaseConfig";
import { signInWithCustomToken } from "firebase/auth";

const RoseLogin = () => {
  const [error, setError] = useState(null);  // Corrected type definition
  const [loading, setLoading] = useState(false);

  // Load Rosefire SDK dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/rosefire.min.js"; // Load from public folder
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (!window.Rosefire) {
        throw new Error("Rosefire script not loaded!");
      }

      // Authenticate with Rosefire
      window.Rosefire.signIn("62c320b3-a749-4d11-9994-4ce75959e8c5", async (err, rfUser) => {
        if (err) {
          console.error("Rosefire error!", err);
          setError("Rosefire login failed.");
          setLoading(false);
          return;
        }

        console.log("Rosefire success!", rfUser);

        // Authenticate with Firebase using the token
        try {
          await signInWithCustomToken(auth, rfUser.token);
          console.log("Firebase login successful!");
        } catch (firebaseError) {
          console.error("Firebase login error", firebaseError.message);
          setError("Firebase login failed: " + firebaseError.message);
        }
      });
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Login with Rose-Hulman SSO</h1>
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login with Rosefire"}
      </button>
    </div>
  );
};

export default RoseLogin;
