// src/components/LoginPopup.jsx

import { useEffect, useState } from "react";
import { signInWithRosefire } from "../utils/auth";

export default function LoginPopup({ setUser }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleLogin = async () => {
    try {
      const user = await signInWithRosefire();
      setUser(user);
      setIsVisible(false);
    } catch (error) {
      alert("Login failed! Please try again.");
    }
  };

  return isVisible ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center">
        <h2 className="text-2xl font-bold mb-4">Sign in to continue</h2>
        <button 
          onClick={handleLogin} 
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Login with Rose-Hulman SSO
        </button>
      </div>
    </div>
  ) : null;
}
