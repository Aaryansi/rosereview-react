import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white text-gray-900 overflow-hidden">
      
      {/*Subtle  Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-red-300 opacity-20 rounded-full blur-[120px] top-20 left-10 animate-pulse"></div>
        <div className="absolute w-80 h-80 bg-red-400 opacity-10 rounded-full blur-[100px] bottom-16 right-16 animate-pulse"></div>
      </div>

      {/* Glassmorphic Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl p-12 text-center max-w-3xl border border-white/40"
      >
        <motion.h1 
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-5xl sm:text-7xl font-extrabold tracking-tight text-gray-900 drop-shadow-lg"
        >
          Find The Best <br />
          <span className="text-red-500">Professors</span> & <span className="text-red-400">Courses</span>
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          className="mt-6 text-lg font-medium text-gray-700 sm:text-xl"
        >
          Get real student insights, rate courses & professors, and explore the best classes at RHIT.
        </motion.p>

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-6"
        >
          <Link to="/courses">
            <motion.button
              whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px rgba(239, 68, 68, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg bg-red-500 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-red-400 transition-all"
            >
              📚 Browse Courses
            </motion.button>
          </Link>
          <Link to="/profs">
            <motion.button
              whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px rgba(220, 38, 38, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg bg-red-600 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-red-500 transition-all"
            >
              👨‍🏫 Browse Professors
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
