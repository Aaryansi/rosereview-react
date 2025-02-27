import { useEffect, useState } from "react";
import { signInWithRosefire } from "../utils/auth";
import { motion } from "framer-motion";

export default function LoginPopup({ setUser }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleLogin = async () => {
    try {
      const user = await signInWithRosefire();
      if (user) {
        setUser(user);
        setIsVisible(false);
      } else {
        // ❌ Handle invalid login case
        setError("Login failed! Please try again.");
      }
    } catch (error) {
      setError("Login failed! Please try again.");
    }
  };

  return isVisible ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-lg">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative bg-white bg-opacity-50 backdrop-blur-md p-8 rounded-xl shadow-2xl text-center w-[90%] max-w-md border border-white/30"
      >
        

        {/* 🔥 Title with Glow */}
        <h2 className="text-4xl font-extrabold text-white mb-4 drop-shadow-lg">
          Welcome to <span className="text-white-400">Rose Reviews</span>
        </h2>

        {/* 🔹 Description */}
        <p className="text-black text-opacity-90 mb-6">
          Sign in using your Rose-Hulman credentials to continue.
        </p>

        

        {/* 🔥 Login Button with Glow & Smooth Animations */}
        <motion.button 
          onClick={handleLogin}
          whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px rgba(255, 50, 50, 0.8)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="px-6 py-3 text-white font-semibold text-lg rounded-full shadow-lg bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transition-all duration-300 glow-effect"
        >
          🐘 Login with Rose-Hulman SSO
        </motion.button>
      </motion.div>
    </div>
  ) : null;
}
