import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-white flex items-center justify-center min-h-screen">

      <div className="relative isolate px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:py-32 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl">
            Find The Best Professors & Courses
          </h1>
          <p className="mt-8 text-lg font-medium text-gray-600 sm:text-xl">
            Get real student reviews, rate professors, and explore the best classes at RHIT.
          </p>

          {/* Call to Action Buttons */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/courses">
              <button className="rounded-md bg-blue-600 px-5 py-3 text-lg font-semibold text-white shadow-lg hover:bg-blue-500 transition">
                📚 Browse Courses
              </button>
            </Link>
            <Link to="/profs">
              <button className="rounded-md bg-green-600 px-5 py-3 text-lg font-semibold text-white shadow-lg hover:bg-green-500 transition">
                👨‍🏫 Browse Professors
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
